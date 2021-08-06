""" Confere quais os releases não têm imagem de capa """
import csv
from argparse import ArgumentParser
import os
import math

def parse_args():
    """ Trata os argumentos passados na linha de comando """
    parser = ArgumentParser()
    parser.add_argument('file', metavar='Arquivo CSV', help='arquivo csv da coleção')
    return parser.parse_args()

def print_table(lista_sem_img):
    """ Imprime uma tabela com os nomes dos releases sem imagem """
    titulos = ['id', 'Artista', 'Título']
    max_width = [len(titulos[0]), len(titulos[1]), len(titulos[2])]

    for release in lista_sem_img:
        max_width[0] = max(max_width[0], len(release[0]))
        max_width[1] = max(max_width[1], len(release[1]))
        max_width[2] = max(max_width[2], len(release[2]))

    #Cabecalho
    print('┌' + ('─' * (max_width[0] + 2)) + '┬' + ('─' * (max_width[1] + 2)) + '┬' +
        ('─' * (max_width[2] + 2)) + '┐')

    cabecalho = ''
    for i in enumerate(titulos):
        cabecalho = '│ ' + (' ' * math.floor((max_width[i] -
        len(titulos[i])) / 2)) + titulos[i] + (' ' * math.ceil(1 + (max_width[i] -
        len(titulos[i])) / 2))

    print (cabecalho + '│')
    print('├' + ('─' * (max_width[0] + 2)) + '┼' + ('─' * (max_width[1] + 2)) + '┼' +
        ('─' * (max_width[2] + 2)) + '┤')

    #Lista
    for release in lista_sem_img:
        print('│ ' + release[0] + (' ' * (max_width[0] - len(release[0]) + 1) + '│') +
          ' ' + release[1] + (' ' * (max_width[1] - len(release[1]) + 1) + '│') +
          ' ' + release[2] + (' ' * (max_width[2] - len(release[2]) + 1)) + '│')

    print('└' + ('─' * (max_width[0] + 2)) + '┴' + ('─' * (max_width[1] + 2)) + '┴' +
        ('─' * (max_width[2] + 2)) + '┘')

def main():
    """ Função principal """
    try:
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
            list_discogs = list(csv_reader)

            for row in list_discogs:
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

            print(str(line_count - 1) + ' lançamento' +
                ('s processados' if line_count > 2 else ' processado') + '. ' +
                str(count) + ' est' + ('ão' if count > 1 else 'á') + ' sem imagem.')

            print_table(lista_sem_img)

    except FileNotFoundError:
        print("Arquivo não encontrado: " + args.file)
    except TypeError:
        print('O arquivo não é um csv válido do Discogs!')

args = parse_args()

main()
