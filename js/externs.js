/**
 * Declaração de namespace
 * @const
 */
var globals = {};

/**
 * @typedef {{
 *            name: string,
 *            qty: string,
 *            descriptions: Array<string>
 *          }}
 * @property {string} name - Nome do tipo
 * @property {string} qty - Quantidade de mídias
 * @property {Array<string>} descriptions - Descrições complementares
 */
var Formats;

/**
 * Dados do artista
 * @typedef {{
 *            name: string,
 *            anv: string,
 *            thumbnail_url: string,
 *            id: number
 *          }}
 * @property {string} name - Nome de acordo com a base do Discogs
 * @property {string} [anv] - Nome conforme exibido no álbum
 * @property {string} [thumbnail_url] - Url para a imagem do artista
 * @property {number} id - Id na base do Discogs
 */
var Artists;

/**
 * Dados das faixas
 * @typedef {{
 *            type_: string,
 *            title: string,
 *            position: string,
 *            duration: string,
 *            artists: Array<Artists>,
 *            extraartists: Array<Artists>,
 *            sub_tracks: Array<Tracks>
 *          }}
 * @property {string} type_ - Tipo que o registro da faixa representa
 * @property {string} title - Título
 * @property {string} [position] - Posição na listagem do álbum
 * @property {string} [duration] - Tempo de duração
 * @property {Array<Artists>} artists - Lista de artistas principais
 * @property {Array<Artists>} extraartists - Lista de crédidos complementares de artistas
 * @property {Array<Tracks>} sub_tracks - Sub faixas pertencentes
 */
var Tracks;

/**
 * Dados de um álbum
 * @typedef {{
 *            id: number,
 *            title: string,
 *            num: string,
 *            artists_sort: string,
 *            artists: Array<Artists>,
 *            lancamento: string,
 *            formats: Array<Formats>,
 *            tracklist: Array<Tracks>,
 *            genres: Array<string>,
 *            styles: Array<string>,
 *            community: Object
 *          }}
 * @property {number} id - Id do lançamento no discogs
 * @property {string} title - Título
 * @property {string} [num] - Contagem de dados do Alasql
 * @property {string} artists_sort - Nome do artista principal
 * @property {Array<Artists>} [artists] - Informações completas dos artistas principais
 * @property {string} lancamento - Ano de lançamento
 * @property {Array<Formats>} formats - Informações do formato da mídia
 * @property {Array<Tracks>} tracklist - Lista de faixas
 * @property {Array<string>} genres - Lista de gêneros
 * @property {Array<string>} styles - Lista de estilos
 * @property {Object} community - Dados sociais da rede do Discogs
 */
var Releases;

/** @type {Object} */
Releases.prototype.community.rating;
/** @type {number} */
Releases.prototype.community.rating.average;

/**
 * List é uma variável global e processada pelo compilador
 * @type Array<Releases>
 */
globals.list;

/**
 * Opções do Fuse
 * @typedef {{
 *            threshold: number,
 *            includeMatches: boolean,
 *            keys: Array<Object>
 *          }}
 * @property {number} threshold - Limiar de tolerância do casamento da chave com o termo o item
 * @property {boolean} includeMatches - Flag se deve incluir os dados do resultado da pesquisa
 * @property {Array<Object>} keys - Propriedades do objeto que devem ser considerados na busca
 */
var Fuse_options;

/**
 * Dados do resultado da busca
 * @typedef {{
 *            indices: Array<Array<Number>>,
 *            key: string,
 *            value: string
 *          }}
 * @property {Array<Array<Number>>} indices - Dados do valor que deu sucesso na pesquisa
 * @property {string} key - Chave da pesquisa
 * @property {string} value - Item encontrado
 */
var Match;

/**
 * @param {Array<Object>} lista
 * @param {Fuse_options} options
 * @constructor
 */
function Fuse(lista, options) {
    /** @type {Function} */
    this.search;
};

var alasql;

var Scrollbar;

var $ = {
    "fn": {
        "init": function () {},
        "selector": {},
        "jquery": {},
        "size": function () {},
        "get": function () {},
        "pushStack": function () {},
        "setArray": function () {},
        "each": function () {},
        "index": function () {},
        "attr": function () {},
        "css": function () {},
        "text": function () {},
        "wrapAll": function () {},
        "wrapInner": function () {},
        "wrap": function () {},
        "append": function () {},
        "prepend": function () {},
        "before": function () {},
        "after": function () {},
        "end": function () {},
        "push": function () {},
        "sort": function () {},
        "splice": function () {},
        "find": function () {},
        "clone": function () {},
        "filter": function () {},
        "closest": function () {},
        "not": function () {},
        "add": function () {},
        "is": function () {},
        "hasClass": function () {},
        "val": function () {},
        "html": function () {},
        "replaceWith": function () {},
        "eq": function () {},
        "slice": function () {},
        "map": function () {},
        "andSelf": function () {},
        "domManip": function () {},
        "extend": function () {},
        "parent": function () {},
        "parents": function () {},
        "next": function () {},
        "prev": function () {},
        "nextAll": function () {},
        "prevAll": function () {},
        "siblings": function () {},
        "children": function () {},
        "contents": function () {},
        "appendTo": function () {},
        "prependTo": function () {},
        "insertBefore": function () {},
        "insertAfter": function () {},
        "replaceAll": function () {},
        "removeAttr": function () {},
        "addClass": function () {},
        "removeClass": function () {},
        "toggleClass": function () {},
        "remove": function () {},
        "empty": function () {},
        "data": function () {},
        "removeData": function () {},
        "queue": function () {},
        "dequeue": function () {},
        "bind": function () {},
        "on": function () {},
        "one": function () {},
        "unbind": function () {},
        "trigger": function () {},
        "triggerHandler": function () {},
        "toggle": function () {},
        "hover": function () {},
        "ready": function () {},
        "live": function () {},
        "die": function () {},
        "blur": function () {},
        "focus": function () {},
        "load": function () {},
        "resize": function () {},
        "scroll": function () {},
        "unload": function () {},
        "click": function () {},
        "dblclick": function () {},
        "mousedown": function () {},
        "mouseup": function () {},
        "mousemove": function () {},
        "mouseover": function () {},
        "mouseout": function () {},
        "mouseenter": function () {},
        "mouseleave": function () {},
        "change": function () {},
        "select": function () {},
        "submit": function () {},
        "keydown": function () {},
        "keypress": function () {},
        "keyup": function () {},
        "error": function () {},
        "_load": function () {},
        "serialize": function () {},
        "serializeArray": function () {},
        "ajaxStart": function () {},
        "ajaxStop": function () {},
        "ajaxComplete": function () {},
        "ajaxError": function () {},
        "ajaxSuccess": function () {},
        "ajaxSend": function () {},
        "show": function () {},
        "hide": function () {},
        "_toggle": function () {},
        "fadeTo": function () {},
        "animate": function () {},
        "stop": function () {},
        "slideDown": function () {},
        "slideUp": function () {},
        "slideToggle": function () {},
        "fadeIn": function () {},
        "fadeOut": function () {},
        "offset": function () {},
        "position": function () {},
        "offsetParent": function () {},
        "scrollLeft": function () {},
        "scrollTop": function () {},
        "innerHeight": function () {},
        "outerHeight": function () {},
        "height": function () {},
        "innerWidth": function () {},
        "outerWidth": function () {},
        "width": function () {}
    },
    "extend": function () {},
    "noConflict": function () {},
    "isFunction": function () {},
    "isArray": function () {},
    "isXMLDoc": function () {},
    "globalEval": function () {},
    "nodeName": function () {},
    "each": function () {},
    "prop": function () {},
    "className": {
        "add": function () {},
        "remove": function () {},
        "has": function () {}
    },
    "swap": function () {},
    "css": function () {},
    "curCSS": function () {},
    "clean": function () {},
    "attr": function () {},
    "trim": function () {},
    "makeArray": function () {},
    "inArray": function () {},
    "merge": function () {},
    "unique": function () {},
    "grep": function () {},
    "map": function () {},
    "browser": {
        "version": {},
        "safari": {},
        "opera": {},
        "msie": {},
        "mozilla": {}
    },
    "cache": {
        "1": {
            "events": {
                "unload": {
                    "1": function () {}
                },
                "load": {
                    "2": function () {}
                }
            },
            "handle": function () {}
        },
        "2": function () {}
    },
    "data": function () {},
    "removeData": function () {},
    "queue": function () {},
    "dequeue": function () {},
    "find": function () {},
    "filter": function () {},
    "expr": {
        "order": {
            "0": {},
            "1": {},
            "2": {},
            "3": {}
        },
        "match": {
            "ID": function () {},
            "CLASS": function () {},
            "NAME": function () {},
            "ATTR": function () {},
            "TAG": function () {},
            "CHILD": function () {},
            "POS": function () {},
            "PSEUDO": function () {}
        },
        "attrMap": {
            "class": {},
            "for": {}
        },
        "attrHandle": {
            "href": function () {}
        },
        "relative": {
            "+": function () {},
            ">": function () {},
            "": function () {},
            "~": function () {}
        },
        "find": {
            "ID": function () {},
            "NAME": function () {},
            "TAG": function () {},
            "CLASS": function () {}
        },
        "preFilter": {
            "CLASS": function () {},
            "ID": function () {},
            "TAG": function () {},
            "CHILD": function () {},
            "ATTR": function () {},
            "PSEUDO": function () {},
            "POS": function () {}
        },
        "filters": {
            "enabled": function () {},
            "disabled": function () {},
            "checked": function () {},
            "selected": function () {},
            "parent": function () {},
            "empty": function () {},
            "has": function () {},
            "header": function () {},
            "text": function () {},
            "radio": function () {},
            "checkbox": function () {},
            "file": function () {},
            "password": function () {},
            "submit": function () {},
            "image": function () {},
            "reset": function () {},
            "button": function () {},
            "input": function () {},
            "hidden": function () {},
            "visible": function () {},
            "animated": function () {}
        },
        "setFilters": {
            "first": function () {},
            "last": function () {},
            "even": function () {},
            "odd": function () {},
            "lt": function () {},
            "gt": function () {},
            "nth": function () {},
            "eq": function () {}
        },
        "filter": {
            "PSEUDO": function () {},
            "CHILD": function () {},
            "ID": function () {},
            "TAG": function () {},
            "CLASS": function () {},
            "ATTR": function () {},
            "POS": function () {}
        },
        ":": {
            "enabled": function () {},
            "disabled": function () {},
            "checked": function () {},
            "selected": function () {},
            "parent": function () {},
            "empty": function () {},
            "has": function () {},
            "header": function () {},
            "text": function () {},
            "radio": function () {},
            "checkbox": function () {},
            "file": function () {},
            "password": function () {},
            "submit": function () {},
            "image": function () {},
            "reset": function () {},
            "button": function () {},
            "input": function () {},
            "hidden": function () {},
            "visible": function () {},
            "animated": function () {}
        }
    },
    "multiFilter": function () {},
    "dir": function () {},
    "nth": function () {},
    "sibling": function () {},
    "event": {
        "add": function () {},
        "guid": {},
        "global": {
            "unload": {},
            "load": {}
        },
        "remove": function () {},
        "trigger": function () {},
        "handle": function () {},
        "props": {
            "0": {},
            "1": {},
            "2": {},
            "3": {},
            "4": {},
            "5": {},
            "6": {},
            "7": {},
            "8": {},
            "9": {},
            "10": {},
            "11": {},
            "12": {},
            "13": {},
            "14": {},
            "15": {},
            "16": {},
            "17": {},
            "18": {},
            "19": {},
            "20": {},
            "21": {},
            "22": {},
            "23": {},
            "24": {},
            "25": {},
            "26": {},
            "27": {},
            "28": {},
            "29": {},
            "30": {},
            "31": {},
            "32": {},
            "33": {}
        },
        "fix": function () {},
        "proxy": function () {},
        "special": {
            "ready": {
                "setup": function () {},
                "teardown": function () {}
            },
            "mouseenter": {
                "setup": function () {},
                "teardown": function () {}
            },
            "mouseleave": {
                "setup": function () {},
                "teardown": function () {}
            }
        },
        "specialAll": {
            "live": {
                "setup": function () {},
                "teardown": function () {}
            }
        },
        "triggered": {}
    },
    "Event": function () {},
    "isReady": {},
    "readyList": function () {},
    "ready": function () {},
    "support": {
        "leadingWhitespace": {},
        "tbody": {},
        "objectAll": {},
        "htmlSerialize": {},
        "style": {},
        "hrefNormalized": {},
        "opacity": {},
        "cssFloat": {},
        "scriptEval": {},
        "noCloneEvent": {},
        "boxModel": {}
    },
    "props": {
        "for": {},
        "class": {},
        "float": {},
        "cssFloat": {},
        "styleFloat": {},
        "readonly": {},
        "maxlength": {},
        "cellspacing": {},
        "rowspan": {},
        "tabindex": {}
    },
    "get": function () {},
    "getScript": function () {},
    "getJSON": function () {},
    "post": function () {},
    "ajaxSetup": function () {},
    "ajaxSettings": {
        "url": {},
        "global": {},
        "type": {},
        "contentType": {},
        "processData": {},
        "async": {},
        "xhr": function () {},
        "accepts": {
            "xml": {},
            "html": {},
            "script": {},
            "json": {},
            "text": {},
            "_default": {}
        }
    },
    "lastModified": function () {},
    "ajax": function () {},
    "handleError": function () {},
    "active": {},
    "httpSuccess": function () {},
    "httpNotModified": function () {},
    "httpData": function () {},
    "param": function () {},
    "speed": function () {},
    "easing": {
        "linear": function () {},
        "swing": function () {}
    },
    "timers": function () {},
    "fx": function () {},
    "offset": {
        "initialize": function () {},
        "bodyOffset": function () {}
    },
    "xLazyLoader": function () {},
    "boxModel": {}
}