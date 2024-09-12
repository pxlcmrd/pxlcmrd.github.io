/**
 * @class Builder
 */
let builder = (function Builder() {
    var $this = this;
    /**
     * Constroi o HTML do item para interface
     * @function item
     * @param {Array<release>} albumList Array de objetos com dados do álbum importados do Discogs
     * @return {string} Retorna o HTML
     */
    this.item = function(albumList) {
        let html = '';
        albumList.forEach(function(album) {
            html +=
                '<div class="playlist col-6 col-md-3 col-lg-2 d-flex flex-column mb-3 px-2">' +
                '    <a class="position-relative" href="#">' +
                '        <img src="' + IMG_URL + album.id + '.jpg" class="img-fluid" alt="' + album.title + '">' +
                '        <div class="playlist_overlay position-absolute d-none w-100 h-100 bg-fading-black" album-id="' + album.id + '">' +
                '            <i class="icon position-absolute"></i>' +
                '        </div>' +
                '    </a>' +
                '    <a href="https://www.discogs.com/' + DISCOGS_LANG + 'release/' + album.id + '">' +
                '        <h2 name="title" class="mt-3 text-white text-center">' + album.title + '</h2>' +
                '    </a>' +
                '    <span class="text-center">' +
                $this.artist(album.artists, true) + '</span>' +
                '</div>';
        });

        return html;
    };

    /**
     * Constroi o HTML da faixa
     * @function item
     * @param {Array<track>} [trackList] Array com o objeto de faixas do álbum
     * @param {boolean} [sub=false] Indica se o HTML deve ser construído conforme uma lista de subfaixas do álbum
     * @return {string} Retorna o HTML
     */
    this.track = function(trackList, sub) {
        var html = '';

        if (!trackList) {
            return '';
        }

        trackList.forEach((track) => {
            html +=
                '<li class="track-item d-flex' + (sub ? ' ps-4' : '') + '">' +
                '    <div class="track-number">' +
                '        <span>' + (track.position || '-') + '</span>' +
                '    </div>' +
                '    <div class="track-title w-100' + (track.type_ == "heading" ? ' font-italic' : '') + '">' +
                '        <span>' + (track.title || '-') + '</span>' +
                '    </div>' +
                '    <div class="track-duration fixed-right">' +
                '        <span>' + (track.duration || '-') + '</span>' +
                '    </div>' +
                '</li>';

            if (track.type_ == "index") {
                html += $this.track(track.sub_tracks, true);
            }
        });

        return html;
    };

    /**
     * Constrói uma string com o nome dos artistas devidamente formatado e corrigido
     * @param {Array<artists>} artists
     * @param {Boolean} [link=false]
     * @returns {string}
     */
    this.artist = function(artists, link) {
        return artists.map((a) => {
            return (link ? '<a href="https://www.discogs.com/' + DISCOGS_LANG + 'artist/' + a.id + '" target="_blank">' : '') + a.name.replace(/(.*) \(\d+\)/gm, '$1') + (link ? '</a>' : '');
        }).join(', ');
    }

    /**
     * Constrói o HTML dos detalhes do álbum
     * @function album
     * @param {release} album 
     * @returns {string}
     */
    this.album = function(album) {
        var html =
            '<a href="https://www.discogs.com/' + DISCOGS_LANG + 'release/' + album.id + '" target="_blank" title="Abrir no Discogs">' +
            '    <h2 name="title" class="mt-3 text-white text-center">' + album.title + '</h2>' +
            '</a>' +
            '    <span class="text-center">' +
            $this.artist(album.artists, true) + '</span>' +
            '<img src="' + IMG_URL + album.id + '.jpg">';

        return html;
    };

    /**
     * Obtém o formato devidamente escrito
     * @function format
     * @param {formato} format 
     * @returns {string}
     */
    this.format = function(format) {
        if (format.name == 'Vinyl') {
            if (format.descriptions) {
                return 'Vinil' + ' ' + (format.descriptions.indexOf("LP") >= 0 ? '12"' : format.descriptions[0]).replace(/"/g, '&quot;');
            } else {
                return 'Vinil';
            }
        } else if (format.name == 'Cassette') {
            return 'K7';
        } else if (format.name == 'Shellac') {
            return '78 RPM';
        } else if (format.name == 'CD' || format.name == 'CDr' || format.name == 'DVD' || format.name == 'Box Set') {
            return format.name;
        } else {
            return format.name;
        }
    }

    /**
     * Gera o HTML da lista ordenada
     * @function sortedList
     * @returns {string}
     */
    this.sortedList = function() {
        var html = '';

        var listaOrdenada = ordena();

        html = listaOrdenada.reduce((h, a, i) => {
            return h +
                '<tr>' +
                '    <th scope="row"><img src="' + (IMG_URL + a.id) + '.jpg"></th>' +
                '    <td>' + $this.artist(a.artists) + '</td>' +                
                '    <td><a href="https://www.discogs.com/' + DISCOGS_LANG + 'release/' + a.id +
                '" target="_blank" title="Abrir no Discogs">' + a.title + '</td>' +
                '    <td>' + a.lancamento + '</td>' +
                '    <td>' + $this.format(a.formats[0]) + '</td>' +
                '</tr>';
        }, html);

        return html;
    }

    return this;
})();