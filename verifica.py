""" Confere quais os releases não têm imagem de capa """
import os
import re
from json import loads
import math

def print_table(lista_sem_img):
    """ Imprime uma tabela com os nomes dos releases sem imagem """
    titulos = ['id', 'Artista', 'Título']
    max_width = [len(titulos[0]), len(titulos[1]), len(titulos[2])]

    if not lista_sem_img:
        return

    for release in lista_sem_img:
        max_width[0] = max(max_width[0], len(release[0]))
        max_width[1] = max(max_width[1], len(release[1]))
        max_width[2] = max(max_width[2], len(release[2]))

    #Cabecalho
    print('┌' + ('─' * (max_width[0] + 2)) + '┬' + ('─' * (max_width[1] + 2)) + '┬' +
          ('─' * (max_width[2] + 2)) + '┐')

    cabecalho = ''
    for index, value in enumerate(titulos):
        cabecalho += '│ ' + (' ' *
                             math.floor((max_width[index] - len(value))
                                        / 2)) + value + (' ' *
                                                         math.ceil(1 + (max_width[index]
                                                                        - len(value)) / 2))

    print(cabecalho + '│')
    print('├' + ('─' * (max_width[0] + 2)) + '┼' + ('─' * (max_width[1] + 2)) + '┼' +
          ('─' * (max_width[2] + 2)) + '┤')

    #Lista
    for release in lista_sem_img:
        print('│ ' + release[0] + (' ' * (max_width[0] - len(release[0]) + 1) + '│') +
              ' ' + release[1] + (' ' * (max_width[1] - len(release[1]) + 1) + '│') +
              ' ' + release[2] + (' ' * (max_width[2] - len(release[2]) + 1)) + '│')

    print('└' + ('─' * (max_width[0] + 2)) + '┴' + ('─' * (max_width[1] + 2)) + '┴' +
          ('─' * (max_width[2] + 2)) + '┘')
    return

def main():
    """ Função principal """
    try:
        with open('assets/js/list.js', encoding="utf8") as arquivo:
            #Inicializa os contadores
            count = 0
            count_erro_track = 0
            line_count = 0
            lista_sem_img = []
            lista_com_erro = ''

            def registra_erro_faixa(motivo, id_release, title, position):
                nonlocal count_erro_track
                nonlocal lista_com_erro
                lista_com_erro = lista_com_erro + ('\n' + motivo + ': ' + id_release +
                                                   ' - ' + title + ' (' + position + ')')
                count_erro_track = count_erro_track + 1

            #Lê o conteúdo do list.js
            list_discogs = loads(arquivo.readline()[11:-1])

            list_capit_correta = ['-me', '-la', '-te', '-se',
                                  "'d", "'s", "'t", "'m", "'re", "'ll", "'ve", "'est"]

            for row in list_discogs:
                #Tenta ver se a imagem do release lido do list.js existe na pasta
                if not os.path.exists('assets/img/covers/' + str(row['id']) + '.jpg'):
                    lista_sem_img.append([str(row['id']), row['artists_sort'], row['title']])
                    count += 1

                tracklist = [a for a in row['tracklist'] if a['type_'] == 'track']

                for track in tracklist:
                    if not re.match(r"^(Video)? ?[A-Z\d]+[.-]?[A-Za-z\d]* ?$", track['position']):
                        registra_erro_faixa('Cód. da posição', str(row['id']),
                                            row['title'], track['position'])
                        break

                    matches = re.findall(r"['-]?\b[a-záéíóúàèìòùãẽĩõũâêîôûäëïöüç]+",
                                         track['title'], re.MULTILINE)

                    if matches:
                        for erros in matches:
                            if erros not in list_capit_correta:
                                registra_erro_faixa('Capitalização', str(row['id']),
                                                    track['title'], track['position'])
                                break

                line_count += 1

            print(str(line_count - 1) + ' lançamento' +
                  ('s processados' if line_count > 2 else ' processado') + '. ' +
                  str(count) + ' est' + ('ão' if count > 1 else 'á') + ' sem imagem.')

            print_table(lista_sem_img)

            if count_erro_track > 0:
                print('\n' + str(count_erro_track) + ' lançamento' +
                      ('s' if count_erro_track > 1 else '') + ' com erro nas faixas.')
                print(lista_com_erro)
            else:
                print('Nenhum lançamento com erro nas faixas encontrado.')


    except FileNotFoundError:
        print("Arquivo não encontrado!")

main()
