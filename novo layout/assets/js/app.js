const IMG_URL = '../../pxlcmrd.github.io/img/';

function getAlbum(id) {
    let pivot, min = 0,
        max = list.length;

    while (min != max) {
        pivot = Math.floor((max - min) / 2) + min;
        if (Number(list[pivot].id) == Number(id)) {
            return list[pivot];
        } else if (Number(list[pivot].id) > Number(id)) {
            max = pivot;
        } else {
            min = pivot;
        }
    }

    /* for (let i = 0; i < list.length; i++) {
         if (list[i].id == id) {
             return list[i];
         }
     }*/
    return {};
}

function getRandomAlbums(n) {
    if (n >= list.length) {
        return list;
    }

    var shuffled = list.slice();
    var randomElements = [];

    for (var i = 0; i < n; i++) {
        var randomIndex = Math.floor(Math.random() * shuffled.length);
        randomElements.push(shuffled[randomIndex]);
        shuffled.splice(randomIndex, 1);
    }

    return randomElements;
}

function renderList(lista) {
    document.getElementById('list').getElementsByClassName('row')[0].innerHTML = builder.item(lista);
}

document.getElementById('list').addEventListener('click', (e) => {
    let $el;

    //Se clicar sobre o ícone
    if (e.target.tagName == 'I' && e.target.classList.contains('icon')) {
        $el = e.target.parentElement;
    } else {
        $el = e.target;
    }

    if ($el.hasAttribute('album-id')) {
        let album = getAlbum($el.getAttribute('album-id'));

        document.getElementById('album').style.display = 'block';
        document.getElementById('album').getElementsByClassName('info')[0].innerHTML = builder.album(album);
        document.getElementById('track_list').innerHTML = builder.track(album.tracklist);
    }
}, false);

document.getElementById('album').getElementsByClassName('fechar')[0].addEventListener('click', (e) => {
    document.getElementById('album').style.display = 'none';
});

var fuse = new Fuse(list, {
    threshold: 0.4,
    keys: [{
        name: "title",
        weight: 1
    }, {
        name: "artists_sort",
        weight: 4
    }, {
        name: "tracklist.title",
        weight: 1
    }, {
        name: "tracklist.artists.name",
        weight: 3
    }]
});

function busca(search_term) {
    if (!search_term) {
        return renderList(getRandomAlbums(12));
    }

    let result = fuse.search(search_term, {
        limit: 24
    });

    renderList(result.map((e) => {
        return e.item;
    }));
}

document.querySelector('#search input').addEventListener('keyup', (e) => {
    console.log(busca(e.target.value));
})

renderList(getRandomAlbums(12));