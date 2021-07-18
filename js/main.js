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