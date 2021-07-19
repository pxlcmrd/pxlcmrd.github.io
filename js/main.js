var conteudo_releases = alasql("SELECT * FROM ? ORDER BY RANDOM() LIMIT 24", [list]).reduce(function(a, v) {
    return a +
        '<div class="col-6 col-sm-4 col-lg-2">' +
        '  <div class="album">' +
        '    <div class="album__cover">' +
        '      <img src="img/' + v.id + '.jpg" onerror="this.src=\'img/no-image.png\'">' +
        '      <a href="release.html">' +
        '        <i class="fas fa-search-plus"></i>' +
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
        //'    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        //'      <path d="M12.71,12.54a1,1,0,0,0-1.42,0l-3,3A1,1,0,0,0,9.71,17L12,14.66,14.29,17a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Zm-3-1.08L12,9.16l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-3-3a1,1,0,0,0-1.42,0l-3,3a1,1,0,0,0,1.42,1.42Z">' +
        //'      </path>' +
        //'    </svg> ' +
        '  </span>' +
        '  <a data-link="" data-title="' + v.artists[0].name + '" data-artist="AudioPizza" data-img="' + v.artists[0].thumbnail_url + '" href="https://www.discogs.com/pt_BR/artist/' + v.artists[0].id + '" class="single-item__cover">' +
        '    <img src="' + v.artists[0].thumbnail_url + '"  onerror="this.src=\'img/no-image.png\'">' +
        //'    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        //'      <path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z">' +
        //'      </path>' +
        //'    </svg>' +
        //'    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        //'      <path d="M16,2a3,3,0,0,0-3,3V19a3,3,0,0,0,6,0V5A3,3,0,0,0,16,2Zm1,17a1,1,0,0,1-2,0V5a1,1,0,0,1,2,0ZM8,2A3,3,0,0,0,5,5V19a3,3,0,0,0,6,0V5A3,3,0,0,0,8,2ZM9,19a1,1,0,0,1-2,0V5A1,1,0,0,1,9,5Z">' +
        //'      </path>' +
        //'    </svg>' +
        '    <i class="fas fa-microphone-alt" style="color:#25a56a"></i>' +
        '    <i class="fas fa-microphone-alt" style="color:#25a56a"></i>' +
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
        '  <a data-link="" data-title="Got What I Got" data-artist="Jason Aldean" data-img="img/covers/cover.svg" href="#" class="single-item__cover">' +
        '    <img src="img/covers/cover.svg" alt="">' +
        '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '      <path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z">' +
        '      </path>' +
        '    </svg>' +
        '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '      <path d="M16,2a3,3,0,0,0-3,3V19a3,3,0,0,0,6,0V5A3,3,0,0,0,16,2Zm1,17a1,1,0,0,1-2,0V5a1,1,0,0,1,2,0ZM8,2A3,3,0,0,0,5,5V19a3,3,0,0,0,6,0V5A3,3,0,0,0,8,2ZM9,19a1,1,0,0,1-2,0V5A1,1,0,0,1,9,5Z">' +
        '      </path>' +
        '    </svg>' +
        '  </a>' +
        '  <div class="single-item__title">' +
        '    <h4>' +
        '    <a href="#">' + top5_generos[i] +
        '    </a></h4>' +
        //'    <span>' +
        //'      <a href="#">Jason Aldean' +
        //'      </a>' +
        //'    </span>' +
        '  </div>' +
        '  <span class="single-item__time">' + generos[top5_generos[i]] +
        '  </span>' +
        '</li>';

    conteudo_formatos +=
        '<li class="single-item">' +
        '<i class="fas fa-2x fa-' + (top5_formatos[i].indexOf('Vinyl') > -1 ? 'record-vinyl' : 'compact-disc') + '"></i>' +
        '  <a data-link="" data-title="Supalonely" data-artist="BENEE Featuring" data-img="img/covers/cover9.jpg" href="https://dmitryvolkov.me/demo/blast2.0/audio/9106709_epic-adventure-cinematic-trailer_by_audiopizza_preview.mp3" class="single-item__cover">' +
        /*'    <img src="img/covers/cover9.jpg" alt="">' +
        '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '      <path d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z">' +
        '      </path>' +
        '    </svg>' +
        '    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '      <path d="M16,2a3,3,0,0,0-3,3V19a3,3,0,0,0,6,0V5A3,3,0,0,0,16,2Zm1,17a1,1,0,0,1-2,0V5a1,1,0,0,1,2,0ZM8,2A3,3,0,0,0,5,5V19a3,3,0,0,0,6,0V5A3,3,0,0,0,8,2ZM9,19a1,1,0,0,1-2,0V5A1,1,0,0,1,9,5Z">' +
        '      </path>' +
        '    </svg>' +*/
        '  </a>' +
        '  <div class="single-item__title">' +
        '    <h4>' +
        '    ' + top5_formatos[i] +
        '    </h4>' +
        //'    <span>' +
        //'      <a href="artist.html">BENEE Featuring' +
        //'      </a>' +
        //'    </span>' +
        '  </div>' +
        '  <span class="single-item__time">' + formatos[top5_formatos[i]] +
        '  </span>' +
        '</li>';
}

document.getElementById("top_generos").innerHTML = conteudo_generos;
document.getElementById("top_formatos").innerHTML = conteudo_formatos;