/**
 * Declaração de namespace
 * @const
 */
var globals = {};

/**
 * @typedef {object} Formato
 * @property {string} name - Nome do tipo
 * @property {string} qty - Quantidade de mídias
 * @property {Array<string>} descriptions - Descrições complementares
 */

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
 *          }} Track
 * @property {string} type_ Tipo que o registro da faixa representa
 * @property {string} title Título
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
 *            country: string,
 *            artists_sort: string,
 *            artists: Array<Artists>,
 *            lancamento: string,
 *            formats: Array<Formato>,
 *            tracklist: Array<Tracks>,
 *            genres: Array<string>,
 *            styles: Array<string>,
 *            community: Object
 *          }} Release
 * @property {number} id - Id do lançamento no discogs
 * @property {string} title - Título
 * @property {string} [num] - Contagem de dados do Alasql
 * @property {string} country - Nome do país
 * @property {string} artists_sort - Nome do artista principal
 * @property {Array<Artists>} [artists] - Informações completas dos artistas principais
 * @property {string} lancamento - Ano de lançamento
 * @property {Array<Formato>} formats - Informações do formato da mídia
 * @property {Array<Tracks>} tracklist - Lista de faixas
 * @property {Array<string>} genres - Lista de gêneros
 * @property {Array<string>} styles - Lista de estilos
 * @property {Object} community - Dados sociais da rede do Discogs
 */

/**
 * List é uma variável global e processada pelo compilador
 * @type Array<Release>
 */
var list;

/**
 * Classe do plugin Fuse
 */
class Fuse {
    /**
     * Opções para personalizar a(s) chave(s) de pesquisa
     * @typedef {object} FuseKeysOptions
     * @property {string} name Nome do membro a ser considerado uma chave de pesquisa
     * @property {number} weight Peso da respectiva chave para calcular o ponderamento do resultado
     */

    /**
     * Opções de construção do Fuse
     * @typedef {object} FuseOptions
     * @property {number} [threshold=0.6] O ponto em que o algoritmo deixa de buscar um resultado. Um valor de 0.0 requer uma correspondência perfeita enquanto de 1.0 aceitaria qualquer correspondência
     * @property {Array<FuseKeysOptions>} [keys] Lista de chaves que serão consideradas na pesquisa
     */

    /**
     * Opções específicas de pesquisa
     * @typedef {object} FuseSearchOptions
     * @property {number} limit Número máximo de resultados retornados
     */

    /**
     * Resultado da pesquisa
     * @typedef {object} FuseSearchResult
     * @property {Release} item Item correspondente na coleção
     * @property {number} refIndex Índice do elemento na coleção original
     */

    /**
     * Intancia um objeto do Fuse.js
     * @param {Array<Release>} lista Coleção de objetos para pesquisa
     * @param {FuseOptions} [options] Opções de comportamento do Fuse
     */
    constructor(lista, options) {};

    /**
     * Realisa a busca de um termo na coleção
     * @param {string} termo Termo desejado para pesquisa 
     * @param {FuseSearchOptions} [options] Opções específicas de pesquisa
     * @returns {Array<FuseSearchResult>}
     */
    search(termo, options) {
        return [];
    };
};