/**
 * @typedef formato
 * @property {string} name - Nome do tipo
 * @property {string} [qty] - Quantidade de mídias
 * @property {string} [text] - Texto personalizado
 * @property {Array<string>} [descriptions] - Descrições complementares
 */
var formato;

/**
 * Dados do artista
 * @typedef artists
 * @property {string} name - Nome de acordo com a base do Discogs
 * @property {string} [anv] - Nome conforme exibido no álbum
 * @property {string} [thumbnail_url] - Url para a imagem do artista
 * @property {number} id - Id na base do Discogs
 */
var artists;

/**
 * Dados das faixas
 * @typedef track
 * @property {string} type_ Tipo que o registro da faixa representa
 * @property {string} title Título
 * @property {string} [position] - Posição na listagem do álbum
 * @property {string} [duration] - Tempo de duração
 * @property {Array<artists>} [artists] - Lista de artistas principais
 * @property {Array<artists>} [extraartists] - Lista de crédidos complementares de artistas
 * @property {Array<track>} [sub_tracks] - Sub faixas pertencentes
 */
var track;

/**
 * Dados de um álbum
 * @typedef release
 * @property {number} id - Id do lançamento no discogs
 * @property {string} title - Título
 * @property {string} [num] - Contagem de dados do Alasql
 * @property {string} country - Nome do país
 * @property {string} artists_sort - Nome do artista principal
 * @property {Array<artists>} artists - Informações completas dos artistas principais
 * @property {string} lancamento - Ano de lançamento
 * @property {Array<formato>} formats - Informações do formato da mídia
 * @property {Array<track>} tracklist - Lista de faixas
 * @property {Array<string>} genres - Lista de gêneros
 * @property {Array<string>} styles - Lista de estilos
 * @property {object} community - Dados sociais da rede do Discogs
 */
var release;

/**
 * Opções de construção do Fuse
 * @typedef fuseOptions
 * @property {number} [threshold=0.6] O ponto em que o algoritmo deixa de buscar um resultado. Um valor de 0.0 requer uma correspondência perfeita enquanto de 1.0 aceitaria qualquer correspondência
 * @property {Array<fuseKeysOptions>} [keys] Lista de chaves que serão consideradas na pesquisa
 */
var fuseOptions;

/**
 * Resultado da pesquisa
 * @typedef fuseSearchResult
 * @property {release} item Item correspondente na coleção
 * @property {number} refIndex Índice do elemento na coleção original
 */
var fuseSearchResult;

/**
 * Opções específicas de pesquisa
 * @typedef fuseSearchOptions
 * @property {number} limit Número máximo de resultados retornados
 */
var fuseSearchOptions;

/**
 * Classe do plugin Fuse
 */
class Fuse {
    /**
     * Opções para personalizar a(s) chave(s) de pesquisa
     * @typedef {object} fuseKeysOptions
     * @property {string} name Nome do membro a ser considerado uma chave de pesquisa
     * @property {number} weight Peso da respectiva chave para calcular o ponderamento do resultado
     */

    /**
     * Intancia um objeto do Fuse.js
     * @param {Array<release>} lista Coleção de objetos para pesquisa
     * @param {fuseOptions} [options] Opções de comportamento do Fuse
     */
    constructor(lista, options) {};

    /**
     * Realisa a busca de um termo na coleção
     * @param {string} termo Termo desejado para pesquisa 
     * @param {fuseSearchOptions} [options] Opções específicas de pesquisa
     * @returns {Array<fuseSearchResult>}
     */
    search(termo, options) {
        return [];
    };
};
