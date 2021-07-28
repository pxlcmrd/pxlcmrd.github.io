var main = (function Main() {
    var $this = this;

    var fuse = new Fuse(list, {
        threshold: 0.4,
        includeMatches: true,
        keys: [{
            name: "title",
            weight: 4
        }, {
            name: "artists_sort",
            weight: 2
        }, {
            name: "tracklist.title",
            weight: 4
        }, {
            name: "tracklist.artists.name",
            weight: 2
        }]
    });

    var ordena = function() {
        var lista = JSON.parse(JSON.stringify(list));
        //Lista de releases especiais que precisam ser tratados diferenciadamente
        var arrTrilhas = [2143936, 2693281, 7555262, 7676934, 11127346, 11490895, 12754176, 12774862, 13446777, 14890131];
        var arrNovelas = [221276, 517593, 1348132, 4325218, 1361899, 1378901, 1788971, 2211613, 2413935, 2520470, 2520504, 2533013, 2590676, 2633561, 2658406, 2812048, 5211379, 10771082];

        /**
         * @description Limpa a string de caracteres especiais ou termos indesejáveis para a função de ordenação
         * @name limpaStr
         * @param  {string} s String chave usada na ordenação
         * @return {string}   Retorna a string pronta para ser usada na ordenação
         */
        function limpaStr(s) {
            return s.replace(/[áÁãÃâÂàÀ]/g, 'a').
            replace(/[éÉẽẼêÊèÈ]/g, 'e').
            replace(/[íÍĩĨêÎìÌ]/g, 'i').
            replace(/[óÓõÕôÔ]/g, 'o').
            replace(/[úÚüÜ]/g, 'u').
            replace(/[çÇ]/g, 'c').
            replace(/[ßαΑβΒºª©®™∇µμ◘“”‘’´È¹²³¬°–—¯…¦−]/g, '').
            replace(/^(The|o|a|os|as|los|las|el|l') /gmi, '').trim().toLowerCase();
        }

        /**
         * @description Confere casos excepcionais em que o nome do artista deve ser substituído (traduções ou critério 4.1)
         * @name verificaArtistasEspeciais
         * @param  {Release} r Objeto do release
         * @return {string}    Retorna o nome do artista como deve ser considerado na coleção
         */
        function verificaArtistasEspeciais(r) {
            //Verifica casos de tradução de nome
            if (r.id == 14996403 || r.id == 14970948) {
                return 'Molchat Doma';
            }

            //Verifica títulos mais consagrados do que o crédito no artista
            //       Doces Bárbaros         //Psicopretas
            if (r.id == 9299219 || r.id == 13770359) {
                return r.title;
            }

            //Verifica nomes que exigem substituição (Detalhes de créditos)
            if (r.id == 3696794 || r.id == 4699464) {
                return 'Raul Seixas';
            } else if (r.id == 3677642 || r.id == 1373314) {
                return 'Santa Esmeralda';
            } else if (r.id == 15421432) {
                return 'Tito Madi';
            } else if (r.artists_sort == 'Raimundo Fagner') {
                return 'Fagner';
            }

            //Verifica nomes com algarismos
            if (/^\b\d+\b/.test(r.artists_sort)) {
                var num = r.artists_sort.replace(/^(\b\d+\b).*/, '$1');
                num = ('000000000' + num).slice(-9);
                return r.artists_sort.replace(/^\b\d+\b(.*)/, num + '$1');
            }

            //Verifica Vários e desconhecidos ou trilha sonoras
            if (r.artists_sort == 'Various' || r.artists_sort == 'Unknown Artist' || arrTrilhas.indexOf(Number(r['id'])) > 0 || arrNovelas.indexOf(Number(r['id'])) > 0) {
                return r.title;
            }

            return r.artists_sort;
        }

        /**
         * @description Separa os compactos para o final da lista
         * @name verificaFormato
         * @param  {Release} r Objeto do release
         * @return {string}    Se for compacto retorna um string '~' para garantir que a chave de ordenação seja movida para o final da lista
         */
        function verificaFormato(r) {
            var formatos = r.formats.reduce(function(a, v) {
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

        function verificaTrilhaSonora(r) {
            if (arrTrilhas.indexOf(Number(r.id)) >= 0) {
                return '~}';
            } else if (arrNovelas.indexOf(Number(r.id)) >= 0) {
                return '~~' + limpaStr(r.title);
            }

            return '}';
        }

        function verificaVariosDesconhecidos(r) {
            //Exceções como álbuns de tributos
            var arrExcecoes = [15421432, 13770359];
            if ((r.artists_sort == 'Various' || r.artists_sort == 'Unknown Artist') && arrExcecoes.indexOf(Number(r.id)) < 0 && arrTrilhas.indexOf(Number(r.id)) < 0 && arrNovelas.indexOf(Number(r.id) < 0)) {
                return '~';
            } else {
                return '}';
            }
        }

        /**
         * @description Compara 2 lançamentos 'a' e 'b' e indica qual deve vir antes na lista.
         * Os critérios devem ser:
         * v   1. Duas categorias principais, I e II, sendo descritas e ordenadas conforme a seguir:
         * v       1.1. Categoria I: LPs, 12" e 10";
         * v       1.2. Categoria II: 7",
         *    2. Categoria I deve ser dividida e ordenada conforme a seguir:
         * v      2.1. Principais: Lançamentos comuns de um artista ou conjunto que não se enquadram nas categorias abaixo;
         *        2.2. Vários artistas: Lançamentos comuns que contém vários artistas ou conjuntos ou artistas desconhecidos que não seja álbum de tributo e que não se enquadram nas categorias abaixo;
         *        2.3. Compilações: Lançamentos com apanhado de trilhas não inéditas (que pertencem a produtos lançados previamente). Não inclui compilações de conteúdos inéditos nem lançamentos que se enquadram nas categorias abaixo;
         * v      2.4. Trilhas sonoras: Lançamentos que compreendem a trilha sonora de uma produção. Deve ser subcategorizado e ordenado como a seguir:
         * v          2.4.1. Produções: Trilhas de filmes, jogos, séries, programas televisivos, etc;
         * v          2.4.2. Novelas: Trilhas de novelas.
         *    3. Todas categorias e subcategorias, exceto quando particularmente especificados, devem obedecer os seguintes critérios:
         * v      3.1. Não deve diferenciar letras maiúsculas de minúsculas;
         * v      3.2. Não deve diferenciar acentos gráficos e caracteres especiais;
         * v      3.3. Não deve considerar artigos;
         * v      3.4. Números devem ser considerados sua ordem de grandeza, não alfabética;
         * v      3.5. Ordem alfabética de artistas;
         * v      3.6. Ordem de data de lançamento original do álbum;
         *    4. Casos particulares são os seguintes:
         *        4.1. Casos 2.2 em que o lançamento é tão importante, ou seja, quando seu título assume sua própria identidade, devem considerar o título no lugar do artista e serem alocados na categoria 2.1;
         *        4.2. Casos 2.4 devem ser ordenados pelo título do album, de acordo com os critérios 3.1 até 3.4
         *
         * @name criterioOrdenacao
         * @param  {Release} a
         * @param  {Release} b
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

            //Verifica os lançamentos de vários artitas ou desconhecidos
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

    function getNomeFormato(format) {
        if (format.name == 'Vinyl') {
            return 'Vinil' + ' ' + (format.descriptions.indexOf("LP") >= 0 ? '12"' : format.descriptions[0]).replace('"', '&quot;');
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

    function geraHtmlTracks(tracklist, type) {
        var i, len, artista, html = '';

        for (i = 0, len = tracklist.length; i < len; i++) {
            artista = tracklist[i].artists && tracklist[i].artists.length ? tracklist[i].artists.reduce(function(a, v, i) {
                return a + (i > 0 ? ', ' : '') + v.name;
            }, '') : '';

            html +=
                '<li class="single-item single-item__' + (type || tracklist[i].type_) + '">' +
                '  <div class="track-item__cover">' + (
                    tracklist[i].type_ == "track" ? '    <i class="fal fa-2x fa-music"></i>' :
                    tracklist[i].type_ == "index" ? '    <i class="fal fa-2x fa-arrow-alt-right"></i>' :
                    '') +
                '  </div>' +
                '  <div class="single-track">' +
                '    <span class="single-track__number">' + tracklist[i].position + '</span>' +
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

    function geraHtmlTituloAlbum(objAlbum) {
        return '<h1>' + objAlbum.artists_sort + ' &ndash; ' + objAlbum.title + '</h1>';
    }

    function geraHtmlAlbum(objAlbum) {
        var html =
            '<div class="release__cover">' +
            '  <img src="img/' + objAlbum.id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
            '</div>' +
            '<div class="release__stat">' +
            '  <span>' +
            '    <i class="fas fa-list"></i> ' + (objAlbum.tracklist ? objAlbum.tracklist.length + ' faixa' + (objAlbum.tracklist.length > 1 ? 's' : '') : '-') +
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

    function geraHtmlListaAlbums(listaAlbums) {
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

        var album, html = "";
        var is_busca = false;

        for (var i = 0, len = Math.min(listaAlbums.length, 24); i < len; i++) {
            //Caso a lista seja do Fuse ou Alasql
            if (listaAlbums[i].item) {
                is_busca = true;
                album = listaAlbums[i].item;
            } else {
                album = listaAlbums[i];
            }

            html +=
                '<div class="col-6 col-sm-4 col-lg-2">' +
                '  <div class="album">' +
                '    <div class="album__cover">' +
                '      <img src="img/' + album.id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
                '      <a class="show_album" href="' + album.id + '">' +
                '        <i class="fas fa-2x fa-search-plus"></i>' +
                '      </a>' +
                '      <span class="album__stat">' +
                '        <span>' +
                '          <i class="fas fa-list"></i> ' + album.tracklist.length +
                '        </span>' +
                '        <span>' +
                '          <i class="far fa-star"></i> ' + album.community.rating.average +
                '        </span>' +
                '      </span>' +
                '    </div>' +
                '    <div class="album__title">' +
                '      <h3>' +
                '        <a class="show_album" href="' + album.id + '">' + (is_busca && listaAlbums[i].matches[0].key == 'title' ? formatMatch(listaAlbums[i].matches[0]) : album.title) + '</a>' +
                '      </h3>' +
                '      <span>' +
                '        <a href="artist.html">' + (is_busca && listaAlbums[i].matches[0].key == 'artists_sort' ? formatMatch(listaAlbums[i].matches[0]) : album.artists_sort) + '</a>' +
                '      </span>' +
                '    </div>' +
                '  </div>' +
                '</div>';
        }

        return html;
    }

    function geraHtmlTop5Artistas() {
        return alasql("SELECT *, count(*) AS num FROM ? WHERE artists_sort != 'Various' GROUP BY artists_sort ORDER BY num DESC LIMIT 5", [list]).reduce(function(a, v, i) {
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

    function geraHtmlTop5Generos() {
        var generos = {};
        list.forEach(function(e) {
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
                $(this).addClass('sidebar__nav-link--active');
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
                $('#lista_ordenada').show().find('#tabela_lista_ordenada tbody').html(ordena().reduce(function(a, v, i) {
                    return a +
                        '<tr>\n' +
                        '  <th scope="row">' + (i + 1) + '</th>\n' +
                        '  <td>' + v.artists_sort + '</td>\n' +
                        '  <td>' + v.title + '</td>\n' +
                        '  <td>' + v.lancamento + '</td>\n' +
                        '  <td>' + getNomeFormato(v.formats[0]) + '</td>\n' +
                        '</tr>\n';
                }, ''));
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

    $this.renderAlbum = function(id) {
        var objAlbum, i, len;

        for (i = 0, len = list.length; i < len; i++) {
            if (list[i].id == id) {
                objAlbum = list[i];
                break;
            }
        }

        $(".main__title--page").html(geraHtmlTituloAlbum(objAlbum));
        $(".release__content").html(geraHtmlAlbum(objAlbum));
        $("#track_list").html(geraHtmlTracks(objAlbum.tracklist));

        $("#album").show();
    };

    $this.renderListaAlbuns = function(listaAlbums) {
        $("#album").hide();
        if (!listaAlbums) {
            listaAlbums = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 12", [list]);
        }
        $("#releases_lista").html(geraHtmlListaAlbums(listaAlbums));
    };

    $this.renderTop5Artistas = function() {
        $("#top_artistas").html(geraHtmlTop5Artistas());
    };

    $this.renderTop5Generos = function() {
        $("#top_generos").html(geraHtmlTop5Generos());
    };

    $this.renderTop5Formatos = function() {
        $("#top_formatos").html(geraHtmlTop5Formatos());
    };

    $this.init = function() {
        initEventos();
        $("#album").hide();
        $this.renderListaAlbuns();
        setTimeout($this.renderTop5Artistas, 200);
        setTimeout($this.renderTop5Generos, 210);
        setTimeout($this.renderTop5Formatos, 220);
    };

    return $this;
})();

main.init();