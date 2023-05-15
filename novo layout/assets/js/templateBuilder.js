let builder = (function Builder() {
    var $this = this;
    /**
     * Constroi o HTML do item para interface
     * @function item
     * @param {Object[]} albumList Array de objetos JSON com dados do álbum importados do Discogs
     * @param {String} id
     * @param {String} title Título
     * @param {String} img Imagem
     * @return {String} Retorna o HTML
     */
    this.item = function(albumList) {
        var html = '';
        albumList.forEach(function(album) {
            html +=
                '<div class="playlist col-6 col-md-3 col-lg-2 d-flex flex-column mb-3 px-2">' +
                '    <a class="position-relative" href="#">' +
                '        <img src="' + IMG_URL + album.id + '.jpg" class="img-fluid" alt="' + album.title + '">' +
                '        <div class="playlist_overlay position-absolute d-none w-100 h-100 bg-fading-black" album-id="' + album.id + '">' +
                '            <i class="icon position-absolute"></i>' +
                '        </div>' +
                '    </a>' +
                '    <a href="#">' +
                '        <h2 name="title" class="mt-3 text-white text-center">' + album.title + '</h2>' +
                '    </a>' +
                '    <span class="text-center">' +
                '        ' + album.artists.map(function(a) {
                    return '<a href="https://www.discogs.com/pt_BR/artist/' + a.id + '" target="_blank">' + a.name.replace(/(.*) \(\d+\)/gm, '$1') + '</a>';
                }).join(', ') + '</span>' +
                //'    </a>' +
                '</div>';
        });

        return html;
    };

    /**
     * Constroi o HTML da faixa
     * @function item
     * @param {String} position Número da faixa
     * @param {String} title Título
     * @param {String} duration Tempo de duração
     * @return {String} Retorna o HTML
     */
    this.track = function(trackList, sub) {
        var html = '';

        trackList.forEach(function(track) {
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

            if (track.type_ != "index" && track.sub_tracks) {
                debugger;
            }

            if (track.type_ == "index") {
                html += $this.track(track.sub_tracks, 'subtrack');
            }
        });

        return html;
    };

    this.album = function(album) {
        var html =
            '<h2 name="title" class="mt-3 text-white text-center">' + album.title + '</h2>' +
            '<img src="' + IMG_URL + album.id + '.jpg">';

        return html;
    };

    return this;
})();