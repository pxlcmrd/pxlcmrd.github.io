function getNomeFormato(format) {
    var nome;

    if (format.name == 'Vinyl') {
        nome = 'Vinil' + ' ' + (format.descriptions.indexOf("LP") >= 0 ? '12"' : format.descriptions[0]);
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

$('.header__search .close').on('click', function() {
    $('.header__search').removeClass('header__search--active');
});

$('.header__action--search button').on('click', function() {
    $('.header__search').addClass('header__search--active');
});

$(document).on('click', 'a', function(evt) {
    evt.preventDefault();
    if ($(this).hasClass('show_album')) {
        carregaAlbum(Number($(this).attr('href')));
    }
});

Scrollbar.init($('.release__list')[0], {
    damping: 0.1,
    renderByPixels: true,
    alwaysShowTracks: true,
    continuousScrolling: true
});

var conteudo_releases = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 12", [list]).reduce(function(a, v) {
    return a +
        '<div class="col-6 col-sm-4 col-lg-2">' +
        '  <div class="album">' +
        '    <div class="album__cover">' +
        '      <img src="img/' + v.id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
        '      <a class="show_album" href="' + v.id + '">' +
        '        <i class="fas fa-2x fa-search-plus"></i>' +
        '      </a>' +
        '      <span class="album__stat">' +
        '        <span>' +
        '          <i class="fas fa-list"></i> ' + v.tracklist.length +
        '        </span>' +
        '        <span>' +
        '          <i class="far fa-star"></i> ' + v.community.rating.average +
        '        </span>' +
        '      </span>' +
        '    </div>' +
        '    <div class="album__title">' +
        '      <h3>' +
        '        <a class="show_album" href="' + v.id + '">' + v.title + '</a>' +
        '      </h3>' +
        '      <span>' +
        '        <a href="artist.html">' + v.artists_sort + '</a>' +
        '      </span>' +
        '    </div>' +
        '  </div>' +
        '</div>';
}, '');

$("#releases").append(conteudo_releases);

var conteudo_artistas = alasql("SELECT *, count(*) AS num FROM ? WHERE artists_sort != 'Various' GROUP BY artists_sort ORDER BY num DESC LIMIT 5", [list]).reduce(function(a, v, i) {
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

$("#top_artistas").html(conteudo_artistas);

var generos = {};
var formatos = {};

list.forEach(function(e) {
    (e.styles || e.genres).forEach(function(g) {
        if (!generos[g]) {
            generos[g] = 1;
        } else {
            generos[g]++;
        }
    });
    e.formats.forEach(function(f) {
        var nome = getNomeFormato(f);

        if (!formatos[nome]) {
            formatos[nome] = 1;
        } else {
            formatos[nome]++;
        }
    });
});

var top5_generos = Object.keys(generos).sort(function(a, b) {
    return generos[a] > generos[b] ? -1 : 1;
});

var top5_formatos = Object.keys(formatos).sort(function(a, b) {
    return formatos[a] > formatos[b] ? -1 : 1;
});

var conteudo_generos = "";
var conteudo_formatos = "";

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

$("#top_generos").html(conteudo_generos);

$("#top_formatos").html(conteudo_formatos);

function carregaAlbum(id) {
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

    var objAlbum, i, len;

    for (i = 0, len = list.length; i < len; i++) {
        if (list[i].id == id) {
            objAlbum = list[i];
            break;
        }
    }

    $(".main__title--page").html('<h1>' + objAlbum.artists_sort + ' &ndash; ' + objAlbum.title + '</h1>');
    $(".release__content").html(
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
        '</div>');

    $("#track_list").html(geraHtmlTracks(objAlbum.tracklist));
    $("#album").show();
}