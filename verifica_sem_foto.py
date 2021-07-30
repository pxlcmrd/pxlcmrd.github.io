import csv
from argparse import ArgumentParser
import os
import math

def parse_args():
    parser = ArgumentParser()
    parser.add_argument('file', metavar='Arquivo CSV', help='arquivo csv da coleção')
    return parser.parse_args()

def main():
    try:
        if not args.file.endswith('.csv'):
            raise Exception("O arquivo deve ser do formato .csv!")

        with open(args.file, encoding="utf8") as csv_file:
            #Inicializa os contadores
            count = 0
            line_count = 0
            col_id = 0
            col_title = 0
            col_artist = 0
            lista_sem_img = []

            #Lê o conteúdo do csv
            csv_reader = csv.reader(csv_file, delimiter=',')
            l = list(csv_reader)

            if len(l) == 0:
                raise TypeError
            if len(l) == 1:
                raise Exception("A listagem está vazia!")

            for row in l:
                #A primeira linha do csv é apenas os títulos das colunas
                if line_count == 0:
                    idx_col = 0
                    for coluna in row:
                        #Busca o índice da coluna 'release_id'
                        if coluna == 'release_id':
                            col_id = idx_col
                        elif coluna == 'Title':
                            col_title = idx_col
                        elif coluna == 'Artist':
                            col_artist = idx_col
                        idx_col += 1

                    if col_id == col_title == col_artist:
                        raise TypeError
                else:
                    #Tenta ver se a imagem do release lido do csv já existe na pasta
                    if not os.path.exists('img/' + row[col_id] + '.jpg'):
                        #Se existir ele é reaproveitado
                        lista_sem_img.append([row[col_id], row[col_artist], row[col_title]])
                        count += 1

                line_count += 1

            print(str(line_count - 1) + ' lançamento' + ('s processados' if line_count > 2 else ' processado') + '. ' +
                str(count) + ' est' + ('ão' if count > 1 else 'á') + ' sem imagem.')

            titulos = ['id', 'Artista', 'Título']
            max_width = [len(titulos[0]), len(titulos[1]), len(titulos[2])];

            for r in lista_sem_img:
                max_width[0] = max(max_width[0], len(r[0]))
                max_width[1] = max(max_width[1], len(r[1]))
                max_width[2] = max(max_width[2], len(r[2]))

            #Cabecalho
            print('┌' + ('─' * (max_width[0] + 2)) + '┬' + ('─' * (max_width[1] + 2)) + '┬' + ('─' * (max_width[2] + 2)) + '┐')

            cabecalho = ''
            for i in range(len(titulos)):
                cabecalho += '│ ' + (' ' * math.floor((max_width[i] - len(titulos[i])) / 2)) + titulos[i] + (' ' * math.ceil(1 + (max_width[i] - len(titulos[i])) / 2))

            print (cabecalho + '│')
            print('├' + ('─' * (max_width[0] + 2)) + '┼' + ('─' * (max_width[1] + 2)) + '┼' + ('─' * (max_width[2] + 2)) + '┤')

            #Lista
            for r in lista_sem_img:
                print('│ ' + r[0] + (' ' * (max_width[0] - len(r[0]) + 1) + '│') +
                  ' ' + r[1] + (' ' * (max_width[1] - len(r[1]) + 1) + '│') +
                  ' ' + r[2] + (' ' * (max_width[2] - len(r[2]) + 1)) + '│')

            print('└' + ('─' * (max_width[0] + 2)) + '┴' + ('─' * (max_width[1] + 2)) + '┴' + ('─' * (max_width[2] + 2)) + '┘')

    except FileNotFoundError:
        print("Arquivo não encontrado: " + args.file)
    except TypeError:
        print('O arquivo não é um csv válido do Discogs!')
    except Exception as error:
        print(error)

args = parse_args()

main()
