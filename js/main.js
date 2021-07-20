document.getElementsByClassName('header__search')[0].getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementsByClassName('header__search')[0].classList.remove('header__search--active');
});

document.getElementsByClassName('header__action--search')[0].getElementsByTagName('button')[0].addEventListener('click', function() {
    document.getElementsByClassName('header__search')[0].classList.add('header__search--active');
});

var conteudo_releases = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 24", [list]).reduce(function(a, v) {
    return a +
        '<div class="col-6 col-sm-4 col-lg-2">' +
        '  <div class="album">' +
        '    <div class="album__cover">' +
        '      <img src="img/' + v.id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
        '      <a href="release.html">' +
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
        '      <a href="release.html">' + v.title +
        '      </a>' +
        '      </h3>' +
        '      <span>' +
        '        <a href="artist.html">' + v.artists_sort +
        '        </a>' +
        '      </span>' +
        '    </div>' +
        '  </div>' +
        '</div>';
}, '');

document.getElementById("releases").innerHTML = document.getElementById("releases").innerHTML + conteudo_releases;

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

//console.log(conteudo_artistas);

document.getElementById("top_artistas").innerHTML = conteudo_artistas;

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
        var nome = f.name;

        if (f.descriptions && nome == "Vinyl") {
            nome += ' ' + (f.descriptions.indexOf("LP") >= 0 ? '12"' : f.descriptions[0]);
        }

        if (nome == "Vinyl Album" || nome == "Vinyl Compilation") {
            debugger;
        }

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

    conteudo_formatos +=
        '<li class="single-item">' +
        '<i class="fas fa-2x fa-' + (top5_formatos[i].indexOf('Vinyl') > -1 ? 'record-vinyl' : top5_formatos[i] == 'Cassette' ? 'cassette-tape' : 'compact-disc') + '"></i>' +
        '  <div class="single-item__title">' +
        '    <h4>' +
        '    ' + top5_formatos[i] +
        '    </h4>' +
        '  </div>' +
        '  <span class="single-item__time">' + formatos[top5_formatos[i]] +
        '  </span>' +
        '</li>';
}

document.getElementById("top_generos").innerHTML = conteudo_generos;
document.getElementById("top_formatos").innerHTML = conteudo_formatos;