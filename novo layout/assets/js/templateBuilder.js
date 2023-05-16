/**
 * @class Builder
 */
let builder = (function Builder() {
    var $this = this;
    /**
     * Constroi o HTML do item para interface
     * @function item
     * @param {Array<Release>} albumList Array de objetos com dados do álbum importados do Discogs
     * @return {String} Retorna o HTML
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
                album.artists.map((a) => {
                    return '<a href="https://www.discogs.com/' + DISCOGS_LANG + 'artist/' + a.id + '" target="_blank">' + a.name.replace(/(.*) \(\d+\)/gm, '$1') + '</a>';
                }).join(', ') + '</span>' +
                '</div>';
        });

        return html;
    };

    /**
     * Constroi o HTML da faixa
     * @function item
     * @param {Array<Track>} trackList Array com o objeto de faixas do álbum
     * @param {boolean} [sub=false] Indica se o HTML deve ser construído conforme uma lista de subfaixas do álbum
     * @return {String} Retorna o HTML
     */
    this.track = function(trackList, sub) {
        var html = '';

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

    this.album = function(album) {
        var html =
            '<a href="https://www.discogs.com/' + DISCOGS_LANG + 'release/' + album.id + '" target="_blank" title="Abrir no Discogs">' +
            '    <h2 name="title" class="mt-3 text-white text-center">' + album.title + '</h2>' +
            '</a>' +
            '    <span class="text-center">' +
            album.artists.map((a) => {
                return '<a href="https://www.discogs.com/' + DISCOGS_LANG + 'artist/' + a.id + '" target="_blank">' + a.name.replace(/(.*) \(\d+\)/gm, '$1') + '</a>';
            }).join(', ') + '</span>' +
            '<img src="' + IMG_URL + album.id + '.jpg">';

        return html;
    };

    return this;
})();