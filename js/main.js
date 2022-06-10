var main = (function Main() {

    var $this = this;

    var fuse = new Fuse(list, {
        threshold: 0.4,
        includeMatches: true,
        keys: [{
            name: "title",
            weight: 1
        }, {
            name: "artists_sort",
            weight: 4
        }, {
            name: "tracklist.title",
            weight: 1
        }, {
            name: "tracklist.artists.name",
            weight: 3
        }]
    });

    /**
     * @function ordena
     * @description Faz a ordenação da lista de acordo com os critérios adotados para a coleção
     */
    var ordena = function() {
        var lista = JSON.parse(JSON.stringify(list));

        /**
         * @function limpaStr
         * @description Limpa a string de caracteres especiais ou termos
         * indesejáveis para a função de ordenação
         * @param  {string} texto - String chave usada na ordenação
         * @return {string} Retorna a string pronta para ser usada na ordenação
         */
        function limpaStr(texto) {
            return texto.replace(/[áÁãÃâÂàÀ]/g, 'a').
            replace(/[éÉẽẼêÊèÈ]/g, 'e').
            replace(/[íÍĩĨêÎìÌ]/g, 'i').
            replace(/[óÓõÕôÔ]/g, 'o').
            replace(/[úÚüÜ]/g, 'u').
            replace(/[çÇ]/g, 'c').
            replace(/[ßαΑβΒºª©®™∇µμ◘“”‘’´È¹²³¬°–—¯…¦−]/g, '').
            replace(/^(The|o|a|os|as|los|las|el|l') /gmi, '').trim().toLowerCase();
        }

        /**
         * @function verificaArtistasEspeciais
         * @description Confere casos excepcionais em que o nome do artista deve
         * ser substituído (traduções ou critério 4.1)
         * @param  {Releases} release - Objeto do release
         * @return {string} Retorna o nome do artista como deve ser considerado
         * na coleção
         */
        function verificaArtistasEspeciais(release) {
            //Verifica casos de tradução de nome
            if (release.id == 14996403 || release.id == 14970948 || release.id == 16205869) {
                return 'Molchat Doma';
            }

            //Verifica títulos mais consagrados do que o crédito no artista
            //       Doces Bárbaros         //Psicopretas
            if (release.id == 9299219 || release.id == 13770359) {
                return release.title;
            }

            //Verifica nomes que exigem substituição (Detalhes de créditos)
            if (release.id == 3696794 || release.id == 4699464) {
                return 'Raul Seixas';
            } else if (release.id == 3677642 || release.id == 1373314) {
                return 'Santa Esmeralda';
            } else if (release.id == 15421432) {
                return 'Tito Madi';
            } else if (release.artists_sort == 'Raimundo Fagner') {
                return 'Fagner';
            }

            //Verifica nomes com algarismos
            if (/^\b\d+\b/.test(release.artists_sort)) {
                var num = release.artists_sort.replace(/^(\b\d+\b).*/, '$1');
                num = ('000000000' + num).slice(-9);
                return release.artists_sort.replace(/^\b\d+\b(.*)/, num + '$1');
            }

            //Verifica Vários e desconhecidos ou trilha sonoras
            if (release.artists_sort == 'Various' || release.artists_sort == 'Unknown Artist' || arrTrilhas.indexOf(Number(release.id)) > 0 || arrNovelas.indexOf(Number(release.id)) > 0 || arrFunk.indexOf(Number(release.id)) > 0) {
                return release.title;
            }

            return release.artists_sort;
        }

        /**
         * @description Separa os compactos para o final da lista
         * @function verificaFormato
         * @param  {Releases} release Objeto do release
         * @return {string} Retorna um caractere que tem uma certa prioridade na
         * ordenação para garantir que o álbum vá para a posição desejada
         */
        function verificaFormato(release) {
            var formatos = release.formats.reduce(function(a, v) {
                a.push(v.name);
                if (v.descriptions && v.descriptions.length) {
                    v.descriptions.reduce(function(f, d) {
                        f.push(d);
                        return f;
                    }, a);
                }
                return a;
            }, []).join();

            if (/7"/.test(formatos) && !/(LP|12")/.test(formatos)) {
                return '~';
            } else {
                return '}';
            }
        }

        /**
         * @description Separa as trilhas sonoras para o critério 2.4
         * @function verificaTrilhaSonora
         * @param  {Releases} release Objeto do release
         * @return {string} Retorna um caractere que tem uma certa prioridade na
         * ordenação para garantir que o álbum vá para a posição desejada
         */
        function verificaTrilhaSonora(release) {
            if (arrFunk.indexOf(Number(release.id)) >= 0) {
                return '~|';
            } if (arrTrilhas.indexOf(Number(release.id)) >= 0) {
                return '~}';
            } else if (arrNovelas.indexOf(Number(release.id)) >= 0) {
                return '~~' + limpaStr(release.title);
            }

            return '}';
        }

        /**
         * @description Verifica os lançamentos de Vários artistas ou
         * desconhecidos de acordo com o critério 2.2
         * @function verificaVariosDesconhecidos
         * @param  {Releases} release Objeto do release
         * @return {string} Retorna um caractere que tem uma certa prioridade na
         * ordenação para garantir que o álbum vá para a posição desejada
         */
        function verificaVariosDesconhecidos(release) {
            //Exceções como álbuns de tributos
            var arrExcecoes = [15421432, 13770359];
            if ((release.artists_sort == 'Various' || release.artists_sort == 'Unknown Artist') && arrExcecoes.indexOf(Number(release.id)) < 0 && arrTrilhas.indexOf(Number(release.id)) < 0 && arrNovelas.indexOf(Number(release.id) < 0) && arrFunk.indexOf(Number(release.id) < 0)) {
                return '~';
            } else {
                return '}';
            }
        }

        /**
         * @description Compara 2 lançamentos 'a' e 'b' e indica qual deve vir antes na lista.
         * Os critérios devem ser:
         * <ol>
         *   <li>Duas categorias principais, I e II, sendo descritas e ordenadas conforme a seguir:
         *     <ol>
         *       <li>Categoria I: LPs, 12" e 10";</li>
         *       <li>Categoria II: 7".</li>
         *     </ol>
         *   </li>
         *   <li>Categoria I deve ser dividida e ordenada conforme a seguir:
         *     <ol>
         *       <li>Principais: Lançamentos comuns de um artista ou conjunto que não se enquadram nas categorias abaixo;</li>
         *       <li>Vários artistas: Lançamentos comuns que contém vários artistas ou conjuntos ou artistas desconhecidos que não seja álbum de tributo e que não se enquadram nas categorias abaixo;</li>
         *       <li>Compilações: Lançamentos com apanhado de trilhas não inéditas (que pertencem a produtos lançados previamente). Não inclui compilações de conteúdos inéditos nem lançamentos que se enquadram nas categorias abaixo;</li>
         *       <li>Funk Carioca/Miami Bass: Lançamentos que se enquadram no estilo ou gênero de Funk carioca, Rap Freestyle, Miami Bass, Funk melody da primeira e segunda geração, Charme, etc.;</li>
         *       <li>Trilhas sonoras: Lançamentos que compreendem a trilha sonora de uma produção. Deve ser subcategorizado e ordenado como a seguir:
         *         <ol>
         *           <li>Produções: Trilhas de filmes, jogos, séries, programas televisivos, etc;</li>
         *           <li>Novelas: Trilhas de novelas.</li>
         *         </ol>
         *       </li>
         *     </ol>
         *   <li>Todas categorias e subcategorias, exceto quando particularmente especificados, devem obedecer os seguintes critérios:
         *     <ol>
         *       <li>Não deve diferenciar letras maiúsculas de minúsculas;</li>
         *       <li>Não deve diferenciar acentos gráficos e caracteres especiais;</li>
         *       <li>Não deve considerar artigos;</li>
         *       <li>Números devem ser considerados sua ordem de grandeza, não alfabética;</li>
         *       <li>Ordem alfabética de artistas;</li>
         *       <li>Ordem de data de lançamento original do álbum;</li>
         *     </ol>
         *   </li>
         *   <li>Casos particulares são os seguintes:
         *     <ol>
         *       <li>Casos 2.2 em que o lançamento é tão importante, ou seja, quando seu título assume sua própria identidade, devem considerar o título no lugar do artista e serem alocados na categoria 2.1;</li>
         *       <li>Casos 2.4 devem ser ordenados pelo título do album, de acordo com os critérios 3.1 até 3.4</li>
         *     </ol>
         *   </li>
         * </ol>
         * @summary Compara 2 lançamentos de acordo com os critérios estabelecidos
         * @name criterioOrdenacao
         * @function
         * @param  {Releases} a - Álbum 1
         * @param  {Releases} b - Álbum 2
         * @return {number}  Retorna -1 se 'a' deve vir antes de 'b', 1 se deve vir depois ou 0 se a posição não deve ser mudada
         */
        function criterioOrdenacao(a, b) {
            var separator = String.fromCharCode(29);

            //monta a string que serve de chave para ordenação
            var auxa = verificaArtistasEspeciais(a) + separator + a.lancamento + separator + a.title;
            var auxb = verificaArtistasEspeciais(b) + separator + b.lancamento + separator + b.title;

            //Limpa a string de caracteres indesejáveis
            auxa = limpaStr(auxa);
            auxb = limpaStr(auxb);

            //Verifica os lançamentos de vários artistas ou desconhecidos
            auxa = verificaVariosDesconhecidos(a) + auxa;
            auxb = verificaVariosDesconhecidos(b) + auxb;

            //Joga as trilha sonoras para o final da lista principal
            auxa = verificaTrilhaSonora(a) + auxa;
            auxb = verificaTrilhaSonora(b) + auxb;

            //Se o formato for compacto joga para o final da lista
            auxa = verificaFormato(a) + auxa;
            auxb = verificaFormato(b) + auxb;

            if (auxa < auxb) {
                return -1;
            } else if (auxa > auxb) {
                return 1;
            } else {
                return 0;
            }
        }

        //Ordena a lista
        lista.sort(criterioOrdenacao);
        return lista;
    };

    /**
     * @description Retorna o nome do formato principal do álbum devidamente processado e em português
     * @function getNomeFormato
     * @param  {Formats} format Formato do lançamento
     * @return {string} Nome do formato processado e em português
     */
    function getNomeFormato(format) {
        if (format.name == 'Vinyl') {
            return 'Vinil' + ' ' + (format.descriptions.indexOf("LP") >= 0 ? '12"' : format.descriptions[0]).replace(/"/g, '&quot;');
        } else if (format.name == 'Cassette') {
            return 'K7';
        } else if (format.name == 'Shellac') {
            return '78 RPM';
        } else if (format.name == 'CD' || format.name == 'CDr' || format.name == 'DVD' || format.name == 'Box Set') {
            return format.name;
        } else {
            console.warn('Formato desconhecido: ' + format.name);
            return format.name;
        }
    }

    /**
     * @description Produz o html da lista de faixas de um álbum
     * @function geraHtmlTracks
     * @param  {Array<Tracks>} tracklist - Lista de faixas
     * @param  {string} [type] - Explicita o tipo como a faixa deve ser processada
     * @return {string} HTML da listagem de faixas
     */
    function geraHtmlTracks(tracklist, type) {
        var i, len, artista, html = '';

        for (i = 0, len = tracklist.length; i < len; i++) {
            artista = tracklist[i].artists && tracklist[i].artists.length ? tracklist[i].artists.reduce(function(a, v, i) {
                return a + (i > 0 ? ', ' : '') + v.name;
            }, '') : '';

            html +=
                '<li class="single-item single-item__' + (tracklist[i].sub_tracks ? 'track' : (type || tracklist[i].type_)) + '">' +
                '  <div class="track-item__cover">' + (
                    tracklist[i].type_ == "track" ? '    <i class="fal fa-2x fa-music"></i>' :
                    tracklist[i].type_ == "index" ? '    <i class="fal fa-2x fa-arrow-alt-right"></i>' :
                    '') +
                '  </div>' +
                '  <div class="single-track">' +
                '    <span class="single-track__number">' + (tracklist[i].position || "") + '</span>' +
                '  </div>' +
                '  <div class="single-item__title">' +
                '    <h4>' + tracklist[i].title + '</h4>' +
                '    <span>' + artista + '</span>' +
                '  </div>' +
                '  <span class="single-item__time">' + (tracklist[i].duration || '') +
                '  </span>' +
                '</li>' +
                (tracklist[i].type_ == "index" ? geraHtmlTracks(tracklist[i].sub_tracks, tracklist[i].type_) : '');
        }

        return html;
    }

    /**
     * @description Gera HTML com a formatação do título do álbum
     * @function geraHtmlTituloAlbum
     * @param  {Releases} objAlbum Objeto do release
     * @return {string} Retorna o HTML
     */
    function geraHtmlTituloAlbum(objAlbum) {
        return '<h1>' + objAlbum.artists_sort + ' &ndash; ' + objAlbum.title + '</h1>';
    }

    /**
     * @description Gera HTML da visualização dos dados e listagem de faixas de
     * um álbum
     * @function geraHtmlAlbum
     * @param  {Releases} objAlbum Objeto do release
     * @return {string} Retorna o HTML
     */
    function geraHtmlAlbum(objAlbum) {
        var num_tracks = objAlbum.tracklist.reduce(function(a, v) {
            if (v.type_ == 'track') {
                return a + 1;
            } else if (v.type_ == 'index' && v.sub_tracks) {
                return a + v.sub_tracks.reduce(function(a_sub, v_sub) {
                    return a_sub + (v_sub.type_ == 'track');
                }, 0);
            } else {
                return a;
            }
        }, 0);
        var html =
            '<div class="release__cover">' +
            '  <img src="img/' + objAlbum.id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
            '</div>' +
            '<div class="release__stat">' +
            '  <span>' +
            '    <i class="fas fa-list"></i> ' + num_tracks + ' faixa' + (num_tracks > 1 ? 's' : '') +
            '  </span>' +
            '  <span>' +
            '    <i class="far fa-star"></i> ' + objAlbum.community.rating.average +
            '  </span>' +
            '</div>' +
            '<div class="row row--grid release__infos">' +
            '  <div class="col-4" title="' + getNomeFormato(objAlbum.formats[0]) + '">' +
            '    <i class="fas fa-2x fa-' + (
                objAlbum.formats[0].name == 'Box Set' ? 'album-collection' :
                objAlbum.formats[0].name == 'Cassette' ? 'cassette-tape' :
                objAlbum.formats[0].name == 'Vinyl' || objAlbum.formats[0].name == 'Shellac' ? 'record-vinyl' :
                objAlbum.formats[0].name == 'CD' || objAlbum.formats[0].name == 'CDr' || objAlbum.formats[0].name == 'DVD' ? 'compact-disc' : 'album'
            ) + '"></i>' +
            '  </div>' +
            '  <div class="col-4">' +
            '    ' + (objAlbum.country || '') +
            '  </div>' +
            '  <div class="col-4">' +
            '    ' + (objAlbum.lancamento || '') +
            '  </div>' +
            '</div>';

        return html;
    }

    /**
     * @description Instancia o atalho alfabético na interface da listagem ordenada de lançamentos 
     * @function geraAtalhosListaOrdenada
     * @param  {Array<Releases>} lista_ordenada - Lista ordenada de lançamentos
     */
    function geraAtalhosListaOrdenada(lista_ordenada) {
        var letras = [{
            id: "num",
            label: "#",
            regex: /^\d/i
        }, {
            id: "A",
            label: "A",
            regex: /^a/i
        }, {
            id: "B",
            label: "B",
            regex: /^b/i
        }, {
            id: "C",
            label: "C",
            regex: /^c/i
        }, {
            id: "D",
            label: "D",
            regex: /^d/i
        }, {
            id: "E",
            label: "E",
            regex: /^e/i
        }, {
            id: "F",
            label: "F",
            regex: /^f/i
        }, {
            id: "G",
            label: "G",
            regex: /^g/i
        }, {
            id: "H",
            label: "H",
            regex: /^h/i
        }, {
            id: "I",
            label: "I",
            regex: /^i/i
        }, {
            id: "J",
            label: "J",
            regex: /^j/i
        }, {
            id: "K",
            label: "K",
            regex: /^k/i
        }, {
            id: "L",
            label: "L",
            regex: /^l/i
        }, {
            id: "M",
            label: "M",
            regex: /^m/i
        }, {
            id: "N",
            label: "N",
            regex: /^n/i
        }, {
            id: "O",
            label: "O",
            regex: /^o/i
        }, {
            id: "P",
            label: "P",
            regex: /^p/i
        }, {
            id: "Q",
            label: "Q",
            regex: /^q/i
        }, {
            id: "R",
            label: "R",
            regex: /^r/i
        }, {
            id: "S",
            label: "S",
            regex: /^s/i
        }, {
            id: "T",
            label: "T",
            regex: /^t/i
        }, {
            id: "U",
            label: "U",
            regex: /^u/i
        }, {
            id: "V",
            label: "V",
            regex: /^v/i
        }, {
            id: "W",
            label: "W",
            regex: /^w/i
        }, {
            id: "X",
            label: "X",
            regex: /^x/i
        }, {
            id: "Y",
            label: "Y",
            regex: /^y/i
        }, {
            id: "Z",
            label: "Z",
            regex: /^z/i
        }];

        for (var i = 0, j; i < letras.length; i++) {
            //localiza índices
            for (j = 0; j < lista_ordenada.length && letras[i].index === undefined; j++) {
                if (letras[i].regex.test(lista_ordenada[j].artists_sort)) {
                    //console.log(letras[i].label, j, lista_ordenada[j].artists_sort);
                    letras[i].index = j;
                }
            }
            //renderiza HTML
            if (letras[i].index !== undefined) {
                //seta o id na tabela
                $('#tabela_lista_ordenada tr:eq(' + (letras[i].index + 1) + ')').attr('id', letras[i].id)
            }
            $('#lista_ordenada .atalhos [name="' + letras[i].id + '"]').html('<a href="' + letras[i].id + '" tipo="atalho">' + letras[i].label + '</a>');
        }
    }

    /**
     * @description Gera o HTML da listagem de lançamentos na tela principal
     * @name geraHtmlListaAlbums
     * @function
     * @param  {Array<Releases>} listaAlbums - Lista de lançamentos
     * @return {string} Retorna o HTML
     */
    function geraHtmlListaAlbums(listaAlbums) {
        var html = "";

        for (var i = 0, len = Math.min(listaAlbums.length, 24); i < len; i++) {
            html +=
                '<div class="col-6 col-sm-4 col-lg-2">' +
                '  <div class="album">' +
                '    <div class="album__cover">' +
                '      <img src="img/' + listaAlbums[i].id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
                '      <a class="show_album" href="' + listaAlbums[i].id + '">' +
                '        <i class="fas fa-2x fa-search-plus"></i>' +
                '      </a>' +
                '      <span class="album__stat">' +
                '        <span>' +
                '          <i class="fas fa-list"></i> ' + listaAlbums[i].tracklist.reduce(function(a, v) {
                    if (v.type_ == 'track') {
                        return a + 1;
                    } else if (v.type_ == 'index' && v.sub_tracks) {
                        return a + v.sub_tracks.reduce(function(a_sub, v_sub) {
                            return a_sub + (v_sub.type_ == 'track');
                        }, 0);
                    } else {
                        return a;
                    }
                }, 0) +
                '        </span>' +
                '        <span>' +
                '          <i class="far fa-star"></i> ' + listaAlbums[i].community.rating.average +
                '        </span>' +
                '      </span>' +
                '    </div>' +
                '    <div class="album__title">' +
                '      <h3>' +
                '        <a class="show_album" href="' + listaAlbums[i].id + '">' + listaAlbums[i].title + '</a>' +
                '      </h3>' +
                '      <span>' +
                '        <a href="artist.html">' + listaAlbums[i].artists_sort + '</a>' +
                '      </span>' +
                '    </div>' +
                '  </div>' +
                '</div>';
        }

        return html;
    }

    /**
     * @description Calcula e gera o HTML da listagem dos 5 artistas com mais álbuns na coleção
     * @function geraHtmlTop5Artistas
     * @return {string} Retorna o HTML
     */
    function geraHtmlTop5Artistas() {
        /** @type {Array<Releases>} */
        var listaTopArtistas = alasql("SELECT *, count(*) AS num FROM ? WHERE artists_sort != 'Various' GROUP BY artists_sort ORDER BY num DESC LIMIT 5", [list]);
        return listaTopArtistas.reduce(function(a, v, i) {
            return a +
                '<li class="single-item">' +
                '  <span class="single-item__number">' + (i + 1) +
                '  </span>' +
                '  <span class="single-item__rate">' +
                '  </span>' +
                '  <a data-link="" data-title="' + v.artists[0].name + '" data-artist="AudioPizza" data-img="' + v.artists[0].thumbnail_url + '" href="https://www.discogs.com/pt_BR/artist/' + v.artists[0].id + '" class="single-item__cover">' +
                '    <img src="' + v.artists[0].thumbnail_url + '"  onerror="this.src=\'img/no-image.png\'">' +
                '  </a>' +
                '  <div class="single-item__title">' +
                '      <h4>' +
                '      <a href="https://www.discogs.com/pt_BR/artist/' + v.artists[0].id + '">' + (v.artists[0].name.length > 19 ? v.artists[0].name.substr(0, 19) + '&hellip;' : v.artists[0].name) +
                '      </a></h4>' +
                '    <span>' +
                '      <a href="https://www.discogs.com/pt_BR/artist/' + v.artists[0].id + '">' +
                '      </a>' +
                '    </span>' +
                '  </div>' +
                '  <span class="single-item__time">' + v.num +
                '  </span>' +
                '</li>';
        }, '');
    }

    /**
     * @description Calcula e gera o HTML da listagem dos 5 gêneros mais presentes na coleção
     * @function geraHtmlTop5Generos
     * @return {string} Retorna o HTML
     */
    function geraHtmlTop5Generos() {
        var generos = {};
        list.forEach(
            /** @param {Releases} e */
            function(e) {
                (e.styles || e.genres).forEach(function(g) {
                    if (!generos[g]) {
                        generos[g] = 1;
                    } else {
                        generos[g]++;
                    }
                });
            });

        var top5_generos = Object.keys(generos).sort(function(a, b) {
            return generos[a] > generos[b] ? -1 : 1;
        });

        var conteudo_generos = "";
        for (var i = 0; i < 5; i++) {
            if (top5_generos[i]) {
                conteudo_generos +=
                    '<li class="single-item">' +
                    '<i class="far fa-2x fa-' + (
                        top5_generos[i] == 'MPB' ? 'guitar' :
                        top5_generos[i] == 'Pop Rock' ? 'guitar-electric' :
                        top5_generos[i] == 'Synth-pop' ? 'piano-keyboard' :
                        top5_generos[i] == 'Prog Rock' ? 'guitars' :
                        top5_generos[i] == 'Samba' ? 'drum' : 'microphone-stand'
                    ) + '"></i>' +
                    '  <div class="single-item__title">' +
                    '    <h4>' + top5_generos[i] + '</h4>' +
                    '  </div>' +
                    '  <span class="single-item__time">' + generos[top5_generos[i]] +
                    '  </span>' +
                    '</li>';
            }
        }

        return conteudo_generos;
    }

    /**
     * @description Calcula e gera o HTML da listagem dos 5 formatos mais presentes na coleção
     * @function geraHtmlTop5Formatos
     * @return {string} Retorna o HTML
     */
    function geraHtmlTop5Formatos() {
        var formatos = {};

        list.forEach(function(e) {
            e.formats.forEach(function(f) {
                var nome = getNomeFormato(f);

                if (!formatos[nome]) {
                    formatos[nome] = 1;
                } else {
                    formatos[nome]++;
                }
            });
        });

        var top5_formatos = Object.keys(formatos).sort(function(a, b) {
            return formatos[a] > formatos[b] ? -1 : 1;
        });

        var conteudo_formatos = "";

        for (var i = 0; i < 5; i++) {
            if (top5_formatos[i]) {
                conteudo_formatos +=
                    '<li class="single-item">' +
                    '  <i class="fas fa-2x fa-' + (top5_formatos[i].indexOf('Vinil') > -1 ? 'record-vinyl' : top5_formatos[i] == 'K7' ? 'cassette-tape' : 'compact-disc') + '"></i>' +
                    '  <div class="single-item__title">' +
                    '    <h4>' +
                    '    ' + top5_formatos[i] +
                    '    </h4>' +
                    '  </div>' +
                    '  <span class="single-item__time">' + formatos[top5_formatos[i]] +
                    '  </span>' +
                    '</li>';
            }
        }

        return conteudo_formatos;
    }

    /**
     * @description Intancia e inicializa os eventos da interface
     * @function initEventos
     */
    function initEventos() {
        $('.header__search .close').on('click', function() {
            $('.header__search').removeClass('header__search--active');
        });

        $('.header__action--search button').on('click', function() {
            $('.header__search').addClass('header__search--active').find('input').select();
        });

        $('.header__search').on('submit', function(evt) {
            evt.preventDefault();
            return false;
        });

        $(document).on('click', 'a', function(evt) {
            function resetButtons($el) {
                $('.header__btn').toggleClass('header__btn--active');
                $('.sidebar').toggleClass('sidebar--active');
                $('.sidebar__nav .sidebar__nav-link--active').removeClass('sidebar__nav-link--active');
                $($el).addClass('sidebar__nav-link--active');
                $('section').hide();
            }
            evt.preventDefault();
            if ($(this).hasClass('show_album')) {
                $this.renderAlbum(Number($(this).attr('href')));
                $(document).scrollTop(0);
            } else if ($(this).attr('href') == 'home') {
                resetButtons($(this));
                $('#releases, #top_lista').show();
            } else if ($(this).attr('href') == 'lista_ordenada') {
                resetButtons($(this));
                var lista_ordenada = ordena();
                $('#lista_ordenada').show().find('#tabela_lista_ordenada tbody').html(lista_ordenada.reduce(function(a, v, i) {
                    return a +
                        '<tr>\n' +
                        '  <th scope="row">' + (i + 1) + '</th>\n' +
                        '  <td>' + v.artists_sort + '</td>\n' +
                        '  <td>' + v.title + '</td>\n' +
                        '  <td>' + v.lancamento + '</td>\n' +
                        '  <td>' + getNomeFormato(v.formats[0]) + '</td>\n' +
                        '</tr>\n';
                }, ''));
                geraAtalhosListaOrdenada(lista_ordenada);
            } else if ($(this).attr('tipo') == 'atalho') {
                $('#' + $(this).attr('href'))[0].scrollIntoView({
                    block: "center"
                })
            } else {
                console.warn('click não implementado')
            }
        });

        var search_term, timeoutObject = 0;
        $('.header__search input').on('keyup', function() {
            if (search_term == $(this).val().trim()) {
                return;
            } else if ($(this).val().trim() === '') {
                return $this.renderListaAlbuns();
            }

            clearTimeout(timeoutObject);
            search_term = $(this).val().trim();
            timeoutObject = setTimeout(function() {
                var result = fuse.search(search_term);

                //Constroi a lista de release
                result = result.map(function(e) {
                    var titulo = e.matches.reduce(function(a, m) {
                        if (m.key == 'title') {
                            return a + formatMatch(m);
                        } else {
                            return a;
                        }
                    }, '');

                    return {
                        "id": e.item.id,
                        "tracklist": e.item.tracklist,
                        "community": {
                            "rating": {
                                "average": e.item.community.rating.average
                            }
                        },
                        "title": titulo || e.item.title,
                        "artists_sort": e.item.artists_sort
                    };
                });

                $this.renderListaAlbuns(result);
            }, 100);
        });

        Scrollbar.init($('.release__list')[0], {
            damping: 0.1,
            renderByPixels: true,
            alwaysShowTracks: true,
            continuousScrolling: true
        });

        $('.header__btn').on('click', function() {
            $(this).toggleClass('header__btn--active');
            $('.sidebar').toggleClass('sidebar--active');
        });
    }

    /**
     * @description Formata uma string de um resultado de pesquisa
     * atribuindo trechos em negrito aos pedaços que encaixaram com o termo
     * usado
     * @name formatMatch
     * @function
     * @param  {Match} match - Objeto com os dados do resultado da pesquisa do Fuse
     * @return {string} Termo estilizado
     */
    function formatMatch(match) {
        function grifa(str, s_idx, f_idx) {
            return str.slice(0, s_idx) + '<b>' + str.slice(s_idx, f_idx) + '</b>' + str.slice(f_idx);
        }

        var txt = match.value;
        for (var i = match.indices.length - 1; i >= 0; i--) {
            txt = grifa(txt, match.indices[i][0], match.indices[i][1] + 1);
        }

        return txt;
    }

    /**
     * @description Realiza a exibição dos dados de um álbum na interface
     * @function renderAlbum
     * @param  {number} id - Id od album no Discogs
     */
    $this.renderAlbum = function(id) {
        var objAlbum, i, len;

        for (i = 0, len = list.length; i < len; i++) {
            if (list[i].id == id) {
                objAlbum = list[i];
                break;
            }
        }

        $("#album .main__title--page").html(geraHtmlTituloAlbum(objAlbum));
        $(".release__content").html(geraHtmlAlbum(objAlbum));
        $("#track_list").html(geraHtmlTracks(objAlbum.tracklist));

        $("#album").show();
    };

    /**
     * @description Renderiza a listagem de releases na tela principal
     * @function renderListaAlbuns
     * @param  {Array<Releases>} [listaAlbums]
     */
    $this.renderListaAlbuns = function(listaAlbums) {
        $("#album").hide();
        if (!listaAlbums) {
            listaAlbums = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 12", [list]);
        }
        $("#releases_lista").html(geraHtmlListaAlbums(listaAlbums));
    };

    $this.init = function() {
        initEventos();
        $("#album").hide();
        $this.renderListaAlbuns();
        setTimeout(function() {
            $("#top_artistas").html(geraHtmlTop5Artistas());
        }, 200);
        setTimeout(function() {
            $("#top_generos").html(geraHtmlTop5Generos());
        }, 210);
        setTimeout(function() {
            $("#top_formatos").html(geraHtmlTop5Formatos());
        }, 220);
    };

    return $this;
})();

main.init();