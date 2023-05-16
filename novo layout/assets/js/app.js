const IMG_URL = '../../pxlcmrd.github.io/img/';
const DISCOGS_LANG = 'pt_BR/';
const LIST_LIMIT = 12;

var $lista = document.getElementById('list') || document.createElement('div');
var $album = document.getElementById('album') || document.createElement('div');
var $colecao = document.getElementById('colecao') || document.createElement('div');
var $search = document.getElementById('search') || document.createElement('div');

/**
 * Busca o álbum na lista através do id
 * @param {number} id Id do álbum
 * @returns {Release}
 */
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

    //@ts-ignore
    return {};
}

/**
 * Retorna um número n de álbuns áleatórios
 * @param {number} n Número de itens que se deseja
 * @returns {Array<Release>}
 */
function getRandomAlbums(n) {
    if (!n || n >= list.length) {
        return list;
    }

    var shuffled = list.slice();
    /** @type {Array<Release>} */
    var randomElements = [];

    for (let i = 0; i < n; i++) {
        var randomIndex = Math.floor(Math.random() * shuffled.length);
        randomElements.push(shuffled[randomIndex]);
        shuffled.splice(randomIndex, 1);
    }

    return randomElements;
}

/**
 * Gera a lista de álbuns na interface
 * @param {Release[]} albuns Array de álbums para serem inseridos na interface principal
 */
function renderList(albuns) {
    $lista.getElementsByClassName('row')[0].innerHTML = builder.item(albuns);
}

$lista.addEventListener('click', (e) => {
    let $el = e.target;

    //Se clicar sobre o ícone
    //@ts-ignore
    if ($el.tagName == 'I' && $el.classList.contains('icon')) {
        //@ts-ignore
        $el = $el.parentElement;
    }

    //@ts-ignore
    if ($el.hasAttribute('album-id')) {
        //@ts-ignore
        let album = getAlbum($el.getAttribute('album-id'));

        $album.style.display = 'block';
        $album.getElementsByClassName('info')[0].innerHTML = builder.album(album);
        //@ts-ignore
        document.getElementById('track_list').innerHTML = builder.track(album.tracklist);
    }
}, false);

$album.getElementsByClassName('fechar')[0].addEventListener('click', () => {
    $album.style.display = 'none';
});

//@ts-ignore
document.getElementById('sidebar').addEventListener('click', (e) => {
    var $el = e.target;

    //@ts-ignore
    if ($el.getAttribute('name') == 'home') {
        $search.style.removeProperty('display');
        $lista.style.removeProperty('display');
        $album.style.setProperty('display', 'none', 'important');
        $colecao.style.setProperty('display', 'none', 'important');
        //@ts-ignore
    } else if ($el.getAttribute('name') == 'lista_colecao') {
        $lista.style.setProperty('display', 'none', 'important');
        $album.style.setProperty('display', 'none', 'important');
        $search.style.setProperty('display', 'none', 'important');
        $colecao.style.setProperty('display', 'block', 'important');
    }
})

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

/**
 * @param {String} search_term Termo para pesquisa
 * @returns 
 */
function busca(search_term) {
    if (!search_term) {
        return renderList(getRandomAlbums(LIST_LIMIT));
    }

    let result = fuse.search(search_term, {
        limit: LIST_LIMIT * 2
    });

    renderList(result.map((e) => {
        return e.item;
    }));
}

//@ts-ignore
document.querySelector('#search input').addEventListener('keyup', (e) => {
    //@ts-ignore
    busca(e.target.value);
})

renderList(getRandomAlbums(LIST_LIMIT));