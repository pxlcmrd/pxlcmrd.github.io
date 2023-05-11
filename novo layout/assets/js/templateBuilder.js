let builder = (function Builder() {
    var $this = this;
    /**
     * Constroi o HTML do item para interface
     * @function item
     * @param {String} title Título
     * @param {String} artist Artista
     * @param {String} img Imagem
     * @return {String} Retorna o HTML
     */
    this.item = function(albumList) {
        var html = '';
        albumList.forEach(function(album) {
            html +=
                '<div class="playlist col-6 col-md-3 col-lg-2 d-flex flex-column mb-3 px-2">' +
                '    <a class="position-relative" href="#">' +
                '        <img class="img-fluid" src="../../pxlcmrd.github.io/img/' + album.id + '.jpg" alt="">' +
                '        <div class="playlist_overlay position-absolute d-none w-100 h-100 bg-fading-black">' +
                '            <i class="position-absolute far fa-play-circle"></i>' +
                '        </div>' +
                '    </a>' +
                '    <a href="#">' +
                '        <h2 name="title" class="mt-3 text-white text-center">' + album.title + '</h2>' +
                '    </a>' +
                '    <a href="#" class="text-center">' +
                '        <span name="artist" id="#">' + album.artist + '</span>' +
                '    </a>' +
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
                '<li class="track-item d-flex' + (sub ? ' pl-4' : '') + '">' +
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
                html += $this.subtrack(track.sub_tracks);
            }
        });



        return html;
    };

    this.subtrack = function(tracklist) {
        return $this.track(tracklist, true);
    };

    return this;
})();