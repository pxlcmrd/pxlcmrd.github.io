""" Script para importar as capas e o JSON dos releases no discogs e salvar em um arquivo JS """
from json import dumps, loads
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from argparse import ArgumentParser
from time import time, sleep
from re import match
import os

# pylint: disable-msg=C0103
releases = []
releases_min = []
timelap = []

def get_lista_atual():
    """ Obtém a lista atual (se existir) de JSON's salvos """
    try:
        #tenta abrir o arquivo de saída se ele existir
        with open('js/list.js', encoding="utf8") as saida_antiga:
            #carrega o json no python
            return loads(saida_antiga.readline()[11:-1])
    except ValueError:
        return []
    except FileNotFoundError:
        return []

def parse_args():
    """ Trata os argumentos passados na linha de comando """
    parser = ArgumentParser()
    parser.add_argument('-f', '--force', action='store_true', dest='force',
                        help='--force [Força o release a ser baixado novamente]')
    parser.add_argument('-t', '--token', required=False, dest='token',
                        default='PEQJMbWyIhFclTjZKBdCeHQcdgueLISCQNvfqgkO',
                        help='--token [Token (chave) de acesso pessoal para desenvolvedor]')
    return parser.parse_args()

def get_response(url):
    """ Realiza uma requisição para obter uma resposta da API """
    url_request = Request(url + 'token=' + args.token,
                          headers={'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build' +
                                                 '/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko)' +
                                                 ' Chrome/100.0.4896.60 Mobile Safari/537.36'})

    while True:
        try:
            entrada = time()
            with urlopen(url_request) as response:
                data = response.read()
            #O processo tem que dormir para não estourar o limite de acessos do discogs
            saida = time()
            if LIMIT > saida - entrada:
                sleep(LIMIT - saida + entrada)
            break
        except HTTPError:
            print("Limite excedido. Hora de descansar...")
            sleep(30)
            print("Voltando...")
    return data

def get_release(id_release):
    """ Realiza uma requisição para obter o JSON do release """
    dados = get_response('https://api.discogs.com/releases/' + str(id_release) + '?')
    return loads(dados.decode('utf-8'))

def write_file():
    """ Salva os arquivos js (completo e minimizado) """
    def get_id_sort(release):
        return release['id']

    with open('js/list.js', '+w', encoding="utf8") as f_completo, open('js/list.min.js', '+w',
                                                                       encoding="utf8") as f_min:
        #Ordena a lista
        releases.sort(key=get_id_sort)
        releases_min.sort(key=get_id_sort)
        f_completo.write('var list = [' +
                         ','.join(list(map(lambda x:
                                           dumps(x, ensure_ascii=False, separators=(',', ':')),
                                           releases))) + '];')
        f_min.write('var list = [' +
                    ','.join(list(map(lambda x:
                                      dumps(x, ensure_ascii=False, separators=(',', ':')),
                                      releases_min))) + '];')

        f_min.close()

    print('\nArquivo list.js e list.min.js salvos com sucesso!')

def minimize_file(str_json, lancamento=""):
    """ Minimiza o JSON removendo campos desnecessários """
    obj = str_json

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
                arr_artist_min[len(arr_artist_min) - 1]["thumbnail_url"] = artist['thumbnail_url']

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

    return {
        "id": obj['id'],
        "title": obj['title'],
        "artists_sort": obj['artists_sort'],
        "country": obj['country'] if 'country' in obj else "",
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
    }

def get_collection(list_discogs):
    """ Obtém a lista de releases atuais na coleção """
    i = 1
    PER_PAGE = 400
    while True:
        dados = loads(get_response(
            'https://api.discogs.com/users/raphaelzera/collection/folders/' +
            '0/releases?per_page='+ str(PER_PAGE) + "&page=" + str(i) + '&'))
        print('Obtidos ' + str(min(dados['pagination']['items'], i * PER_PAGE)) +
              ' de ' + str(dados['pagination']['items']))

        for release in dados['releases']:
            if len(release['notes']) < 3 or not match(r"\d{3}[\d\?]", release['notes'][2]['value']):
                raise Exception('Data de lançamento não definida para o item ' + str(release['id']))

            list_discogs.append({
                "id": release['id'],
                "lancamento": release['notes'][2]['value']
            })

        i += 1

        if i > dados['pagination']['pages']:
            break
    return list_discogs

def get_id(obj):
    """ Retorna o id do release para ser usado no mapeamento index<->id """
    return obj['id']

def main():
    """ Função principal """

    lista_atual = get_lista_atual()
    #mapeia apenas o id dos releases
    index_lista_atual = list(map(get_id, lista_atual))

    #inicializa os contadores
    contadores = {
        "line": 0,
        "new": 0,
        "old": 0
    }

    print('Buscando coleção do Discogs...')
    list_discogs = []
    get_collection(list_discogs)

    print('\nProcessando releases...')
    for row in list_discogs:
        #Tenta ver se o release já existe no list.js
        try:
            #Se a flag for passada, então é pra forçar a baixar novamente
            if args.force:
                raise ValueError

            #Se existir ele é reaproveitado
            releases.append(lista_atual[index_lista_atual.index(row['id'])])
            contadores['old'] += 1
        except ValueError:
            #Se não existir então carrega do discogs
            releases.append(get_release(row['id']))
            contadores['new'] += 1

        releases_min.append(minimize_file(releases[len(releases) - 1], row['lancamento']))

        if releases[len(releases) - 1]['thumb'] != "" and not os.path.exists(
                'img/' + str(row['id']) + '.jpg'):
            with open('img/' + str(row['id']) + '.jpg', "wb") as file:
                imagem_capa = get_response(releases[len(releases) - 1]['thumb'] + '?')
                file.write(imagem_capa)
                file.close()

        contadores['line'] += 1

        if contadores['line'] % 100 == 0:
            print('Processados ' + str(contadores['line']) + ' de ' + str(len(list_discogs)))

    print(str(contadores['line']) + ' lançamento' +
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

main()
