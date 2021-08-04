import csv
import json
import urllib.request
from urllib.request import Request, urlopen
from argparse import ArgumentParser
from time import sleep
import time
import os

releases = []
releases_min = []
indexListaAtual = []
listaAtual = []
timelap = []

def meanTime():
    timelap.append(time.time())
    if len(timelap) > 10:
        timelap.pop(0)
    mean = 0
    for x in range(len(timelap) - 1):
        mean = mean + timelap[x] - timelap[x + 1]
    return -mean / len(timelap)

def getListaAtual():
    try:
        #tenta abrir o arquivo de saída se ele existir
        saidaAntiga = open('js/list.js', encoding="utf8")
        #carrega o json no python
        return json.loads(saidaAntiga.readline()[11:-1])
    except ValueError:
        return []
    except FileNotFoundError:
        return []

def parse_args():
    parser = ArgumentParser()
    parser.add_argument('file', metavar='Arquivo CSV', help='arquivo csv da coleção')
    parser.add_argument('-t', '--token', required=False, dest='token', default='PEQJMbWyIhFclTjZKBdCeHQcdgueLISCQNvfqgkO', help='--token [Token (chave) de acesso pessoal para desenvolvedor]')
    return parser.parse_args()

def getRelease(id, token):
    response = urllib.request.urlopen(
        "https://api.discogs.com/releases/" + str(id) + ('?token=' + args.token if args.token is not None else ''))
    data = response.read()
    encoding = response.info().get_content_charset('utf-8')
    return json.dumps(json.loads(data.decode(encoding)), ensure_ascii=False, separators=(',', ':'))

def printProgressBar(iteration, total, decimals=1, length=100, fill='█'):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    estimateTotalTime = int(meanTime() * (total - iteration))
    estimateOutput = '(' + (str(estimateTotalTime) if estimateTotalTime < 60 else str(estimateTotalTime // 60) + 'm ' + str(estimateTotalTime % 60)) + 's)'
    print('\r%s |%s| %s%% %s' % ('Progress:', bar, percent, estimateOutput), end='\r')
    if iteration == total:
        print()
    return True

def writeFile():
    def getIdSort(release):
        return json.loads(release)['id']

    f = open('js/list.js', '+w', encoding="utf8")
    f_min = open('js/list.min.js', '+w', encoding="utf8")

    #Ordena a lista
    releases.sort(key=getIdSort)
    releases_min.sort(key=getIdSort)
    f.write('var list = [' + ','.join(releases).replace('True', 'true').replace('None', 'null') + '];')
    f_min.write('var list = [' + ','.join(releases_min).replace('True', 'true').replace('None', 'null') + '];')

    f_min.close()

    print('Arquivo list.js e list.min.js salvos com sucesso!')

def main():
    def getId(obj):
        return obj['id']

    def minimizeFile(strJson, lancamento = ""):
        obj = json.loads(strJson)

        def minArtist(arrArtist):
            if arrArtist is None:
                return []

            arr_artist = []
            for artist in arrArtist:
                arr_artist.append({
                    "name": artist['name']
                })
                if artist.get('anv') != "" and artist.get('anv') is not None:
                    arr_artist[len(arr_artist) - 1]["anv"] = artist['anv']
                arr_artist[len(arr_artist) - 1]["id"] = artist['id']
                if artist.get('thumbnail_url') != "" and artist.get('thumbnail_url') is not None:
                    arr_artist[len(arr_artist) - 1]["thumbnail_url"] = artist['thumbnail_url']

            return arr_artist

        def minTrack(arrTracks):
            if arrTracks is None:
                return []

            arr_tracks = []
            for t in arrTracks:
                track_obj = {}

                if t.get("position") != "" and t.get("position") is not None:
                    track_obj["position"] = t.get("position")
                if t.get("type_") != "" and t.get("type_") is not None:
                    track_obj["type_"] = t.get("type_")
                if t.get("artists") != "" and t.get("artists") is not None:
                    track_obj["artists"] = minArtist(t.get("artists"))
                if t.get("title") != "" and t.get("title") is not None:
                    track_obj["title"] = t.get("title")
                if t.get("extraartists") != "" and t.get("extraartists") is not None:
                    track_obj["extraartists"] = minArtist(t.get("extraartists"))
                if t.get("duration") != "" and t.get("duration") is not None:
                    track_obj["duration"] = t.get("duration")
                if t.get("sub_tracks") != "" and t.get("sub_tracks") is not None:
                    track_obj["sub_tracks"] = minTrack(t.get("sub_tracks"))
                
                arr_tracks.append(track_obj)

            return arr_tracks

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
            "artists": minArtist(obj['artists']),
            "tracklist": minTrack(obj['tracklist'])
        }, ensure_ascii=False, separators=(',', ':'))

    listaAtual = getListaAtual()
    #mapeia apenas o id dos releases
    indexListaAtual = list(map(getId, listaAtual))
    #carrega o arquivo csv
    with open(args.file, encoding="utf8") as csv_file:
        #inicializa os contadores
        column = 0
        line_count = 0
        new_count = 0
        old_count = 0
        #Lê o conteúdo do csv
        csv_reader = csv.reader(csv_file, delimiter=',')
        l = list(csv_reader)
        printProgressBar(line_count, len(l), length=50)
        for row in l:
            #A primeira linha do csv é apenas os títulos das colunas
            if line_count == 0:
                line_count = 1
                for col in row:
                    if col == 'release_id':
                        break
                    column += 1
            else:
                #Tenta ver se o release lido do csv já existe no list.js
                try:
                    #Se existir ele é reaproveitado
                    releases.append(json.dumps(listaAtual[indexListaAtual.index(int(row[column]))], ensure_ascii=False, separators=(',', ':')))
                    old_count += 1
                except ValueError:
                    #Se não existir então carrega do discogs
                    entrada = time.time()
                    releases.append(getRelease(row[column], args.token))
                    new_count += 1
                    #O processo tem que dormir para não estourar o limite de acessos do discogs
                    saida = time.time()
                    if limit > saida - entrada:
                        time.sleep(limit - saida + entrada)

                releases_min.append(minimizeFile(releases[len(releases) - 1], row[12]))

                if json.loads(releases[len(releases) - 1])['thumb'] != "" and not os.path.exists('img/' + row[column] + '.jpg'):
                    req_img = Request(json.loads(releases[len(releases) - 1])['thumb'], headers={'User-Agent': 'Mozilla/5.0'})

                    with open('img/' + row[column] + '.jpg', "wb") as file:
                        file.write(urlopen(req_img).read())
                        file.close()

                line_count += 1
                printProgressBar(line_count, len(l), length=50)

        print(str(line_count - 1) + ' lançamento' + ('s processados' if line_count > 2 else ' processado') + '. ' +
            str(new_count) + ' novo' + ('s' if new_count > 1 else '') + ' e ' + str(old_count) + ' antigo' + ('s' if old_count > 1 else '') + '.')

        writeFile()

args = parse_args()
#Se estiver autenticado pelo token, o Discogs aceita 60 requisições por minuto, se não 25
limit = 1.0 / ((24 if args.token is None else 59) / 60)

if not os.path.isdir('img'):
    os.mkdir('img')

if not os.path.isdir('js'):
    os.mkdir('js')

main()

