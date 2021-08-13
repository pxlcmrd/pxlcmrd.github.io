""" Script para importar as capas e o JSON dos releases no discogs e salvar em um arquivo JS """
import csv
import json
import urllib.request
from urllib.request import Request, urlopen
from argparse import ArgumentParser
import time
import os

releases = []
releases_min = []
timelap = []

def mean_time():
    """ Calcula o tempo médio de execução das requisições ao discogs """
    timelap.append(time.time())
    if len(timelap) > 10:
        timelap.pop(0)
    mean = 0
    for steps in range(len(timelap) - 1):
        mean = mean + timelap[steps] - timelap[steps + 1]
    return -mean / len(timelap)

def get_lista_atual():
    """ Obtém a lista atual (se existir) de JSON's salvos """
    try:
        #tenta abrir o arquivo de saída se ele existir
        with open('js/list.js', encoding="utf8") as saida_antiga:
            #carrega o json no python
            return json.loads(saida_antiga.readline()[11:-1])
    except ValueError:
        return []
    except FileNotFoundError:
        return []

def parse_args():
    """ Trata os argumentos passados na linha de comando """
    parser = ArgumentParser()
    parser.add_argument('-c', required=False, help='arquivo csv da coleção', dest='file')
    parser.add_argument('-f', '--force', nargs='+', required=False, dest='force',
        help='--force [Ids de releases para forçarem a ser baixados e sobrescritos]')
    parser.add_argument('-t', '--token', required=False, dest='token',
        default='PEQJMbWyIhFclTjZKBdCeHQcdgueLISCQNvfqgkO',
        help='--token [Token (chave) de acesso pessoal para desenvolvedor]')
    return parser.parse_args()

def get_release(id_release):
    """ Realiza uma requisição para obter o JSON do release """
    with urllib.request.urlopen("https://api.discogs.com/releases/" + str(id_release) +
        ('?token=' + args.token if args.token is not None else '')) as response:
        data = response.read()
        encoding = response.info().get_content_charset('utf-8')
        return json.dumps(json.loads(data.decode(encoding)),
            ensure_ascii=False, separators=(',', ':'))

def print_progress_bar(iteration, total, decimals=1, length=100, fill='█'):
    """ Imprime a barra de progresso """
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filled_length = int(length * iteration // total)
    barra = fill * filled_length + '-' * (length - filled_length)
    estimate_total_time = int(mean_time() * (total - iteration))
    estimate_output = '(' + (str(estimate_total_time) if estimate_total_time < 60 else
        str(estimate_total_time // 60) + 'm ' + str(estimate_total_time % 60)) + 's)'
    print('\r%s |%s| %s%% %s' % ('Progress:', barra, percent, estimate_output), end='\r')
    if iteration == total:
        print()
    return True

def write_file():
    """ Salva os arquivos js (completo e minimizado) """
    def get_id_sort(release):
        return json.loads(release)['id']

    with open('js/list.js', '+w', encoding="utf8") as f_completo, open('js/list.min.js', '+w',
        encoding="utf8") as f_min:
        #Ordena a lista
        releases.sort(key=get_id_sort)
        releases_min.sort(key=get_id_sort)
        f_completo.write('var list = [' +
            ','.join(releases).replace('True', 'true').replace('None', 'null') + '];')
        f_min.write('var list = [' +
            ','.join(releases_min).replace('True', 'true').replace('None', 'null') + '];')

        f_min.close()

    print('Arquivo list.js e list.min.js salvos com sucesso!')

def minimize_file(str_json, lancamento = ""):
    """ Minimiza o JSON removendo campos desnecessários """
    obj = json.loads(str_json)

    def minimize_artist(arr_artist):
        if arr_artist is None:
            return []

        arr_artist_min = []
        for artist in arr_artist:
            arr_artist_min.append({
                "name": artist['name']
            })
            if artist.get('anv') != "" and artist.get('anv') is not None:
                arr_artist_min[len(arr_artist_min) - 1]["anv"] = artist['anv']
            arr_artist_min[len(arr_artist_min) - 1]["id"] = artist['id']
            if artist.get('thumbnail_url') != "" and artist.get('thumbnail_url') is not None:
                arr_artist_min[len(arr_artist_min) - 1]["thumbnail_url"] = artist[
                'thumbnail_url']

        return arr_artist_min

    def minimize_track(arr_tracks):
        if arr_tracks is None:
            return []

        arr_tracks_min = []
        for track in arr_tracks:
            track_obj = {}

            if track.get("position") != "" and track.get("position") is not None:
                track_obj["position"] = track.get("position")
            if track.get("type_") != "" and track.get("type_") is not None:
                track_obj["type_"] = track.get("type_")
            if track.get("artists") != "" and track.get("artists") is not None:
                track_obj["artists"] = minimize_artist(track.get("artists"))
            if track.get("title") != "" and track.get("title") is not None:
                track_obj["title"] = track.get("title")
            if track.get("extraartists") != "" and track.get("extraartists") is not None:
                track_obj["extraartists"] = minimize_artist(track.get("extraartists"))
            if track.get("duration") != "" and track.get("duration") is not None:
                track_obj["duration"] = track.get("duration")
            if track.get("sub_tracks") != "" and track.get("sub_tracks") is not None:
                track_obj["sub_tracks"] = minimize_track(track.get("sub_tracks"))

            arr_tracks_min.append(track_obj)

        return arr_tracks_min

    return json.dumps({
        "id": obj['id'],
        "title": obj['title'],
        "artists_sort": obj['artists_sort'],
        "country": obj['country'],
        "genres": obj['genres'],
        "styles": obj['styles'] if 'styles' in obj else [],
        "community": {
            "rating": {
                "average": obj['community']['rating']['average']
            }
        },
        "formats": obj['formats'],
        "lancamento": lancamento,
        "artists": minimize_artist(obj['artists']),
        "tracklist": minimize_track(obj['tracklist'])
    }, ensure_ascii=False, separators=(',', ':'))

def get_id(obj):
    """ Retorna o id do release para ser usado no mapeamento index<->id """
    return obj['id']

def main():
    """ Função principal """
    lista_atual = get_lista_atual()
    #mapeia apenas o id dos releases
    index_lista_atual = list(map(get_id, lista_atual))
    #carrega o arquivo csv
    with open(args.file, encoding="utf8") as csv_file:
        #inicializa os contadores
        column = 0
        contadores = {
            "line": 0,
            "new": 0,
            "old": 0
            #line_count = 0
            #new_count = 0
            #old_count = 0
        }
        #Lê o conteúdo do csv
        csv_reader = csv.reader(csv_file, delimiter=',')
        list_discogs = list(csv_reader)
        print_progress_bar(contadores['line'], len(list_discogs), length=50)
        for row in list_discogs:
            #A primeira linha do csv é apenas os títulos das colunas
            if contadores['line'] == 0:
                contadores['line'] = 1
                for col in row:
                    if col == 'release_id':
                        break
                    column += 1
            else:
                #Tenta ver se o release lido do csv já existe no list.js
                try:
                    if args.force is not None and args.force.count(row[column]) >= 1:
                        raise ValueError
                    #Se existir ele é reaproveitado
                    releases.append(json.dumps(
                        lista_atual[index_lista_atual.index(int(row[column]))],
                        ensure_ascii=False, separators=(',', ':')))
                    contadores['old'] += 1
                except ValueError:
                    #Se não existir então carrega do discogs
                    entrada = time.time()
                    releases.append(get_release(row[column]))
                    contadores['new'] += 1
                    #O processo tem que dormir para não estourar o limite de acessos do discogs
                    saida = time.time()
                    if LIMIT > saida - entrada:
                        time.sleep(LIMIT - saida + entrada)

                releases_min.append(minimize_file(releases[len(releases) - 1], row[12]))

                if json.loads(releases[len(releases) - 1])['thumb'] != "" and not os.path.exists(
                    'img/' + row[column] + '.jpg'):
                    req_img = Request(json.loads(releases[len(releases) - 1])['thumb'],
                        headers={'User-Agent': 'Mozilla/5.0'})

                    with open('img/' + row[column] + '.jpg', "wb") as file:
                        with urlopen(req_img) as imagem_capa:
                            file.write(imagem_capa.read())
                        file.close()

                contadores['line'] += 1
                print_progress_bar(contadores['line'], len(list_discogs), length=50)

        print(str(contadores['line'] - 1) + ' lançamento' +
            ('s processados' if contadores['line'] > 2 else ' processado') + '. ' +
            str(contadores['new']) + ' novo' + ('s' if contadores['new'] > 1 else '') + ' e ' +
            str(contadores['old']) + ' antigo' + ('s' if contadores['old'] > 1 else '') + '.')

        write_file()

args = parse_args()
#Se estiver autenticado pelo token, o Discogs aceita 60 requisições por minuto, se não 25
LIMIT = 1.0 / ((24 if args.token is None else 59) / 60)

if not os.path.isdir('img'):
    os.mkdir('img')

if not os.path.isdir('js'):
    os.mkdir('js')

for arquivo in os.listdir("."):
    if arquivo.endswith(".csv"):
        args.file = arquivo
        break

main()
