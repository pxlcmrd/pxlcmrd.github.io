var main = (function Main() {
    var $this = this;

    var fuse = new Fuse(list, {
        threshold: 0.4,
        keys: [
            "title",
            "artists_sort",
            "tracklist.title"
        ]
    });

    function getNomeFormato(format) {
        var nome;

        if (format.name == 'Vinyl') {
            nome = 'Vinil' + ' ' + (format.descriptions.indexOf("LP") >= 0 ? '12"' : format.descriptions[0]).replace('"', '&quot;');
        } else if (format.name == 'Cassette') {
            nome = 'K7';
        } else if (format.name == 'Shellac') {
            nome = '78 RPM';
        } else if (format.name == 'CD' || format.name == 'CDr' || format.name == 'DVD' || format.name == 'Box Set') {
            nome = format.name;
        } else {
            console.warn('Formato desconhecido: ' + format.name);
            nome = format.name;
        }

        return nome;
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
        var album, html = "";
        for (var i = 0, len = Math.min(listaAlbums.length, 24); i < len; i++) {
            //Caso a lista seja do Fuse ou Alasql
            album = listaAlbums[i].item || listaAlbums[i];

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
                '        <a class="show_album" href="' + album.id + '">' + album.title + '</a>' +
                '      </h3>' +
                '      <span>' +
                '        <a href="artist.html">' + album.artists_sort + '</a>' +
                '      </span>' +
                '    </div>' +
                '  </div>' +
                '</div>';
        }

        return html
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

        $(document).on('click', 'a', function(evt) {
            evt.preventDefault();
            if ($(this).hasClass('show_album')) {
                $this.renderAlbum(Number($(this).attr('href')));
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