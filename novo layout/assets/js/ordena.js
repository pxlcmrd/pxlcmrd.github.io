/**
 * @function ordena
 * @description Faz a ordenação da lista de acordo com os critérios adotados para a coleção
 */
var ordena = function() {
    var colecao = list.slice(); //JSON.parse(JSON.stringify(list));

    /**
     * @function limpaStr
     * @description Limpa a string de caracteres especiais ou termos
     * indesejáveis para a função de ordenação
     * @param  {string} texto - String chave usada na ordenação
     * @return {string} Retorna a string pronta para ser usada na ordenação
     */
    function limpaStr(texto) {
        return texto.replace(/[áÁãÃâÂàÀ]/g, 'a').
        replace(/[éÉẽẼêÊèÈ]/g, 'e').
        replace(/[íÍĩĨêÎìÌ]/g, 'i').
        replace(/[óÓõÕôÔ]/g, 'o').
        replace(/[úÚüÜ]/g, 'u').
        replace(/[çÇ]/g, 'c').
        replace(/[ßαΑβΒºª©®™∇µμ◘“”‘’´È¹²³¬°–—¯…¦−]/g, '').
        replace(/^(The|o|a|os|as|los|las|el|l') /gmi, '').trim().toLowerCase();
    }

    /**
     * @function verificaArtistasEspeciais
     * @description Confere casos excepcionais em que o nome do artista deve
     * ser substituído (traduções ou critério 4.1)
     * @param  {Release} release - Objeto do release
     * @return {string} Retorna o nome do artista como deve ser considerado
     * na coleção
     */
    function verificaArtistasEspeciais(release) {
        //Verifica casos de tradução de nome
        if (release.id == 14996403 || release.id == 14970948 || release.id == 16205869) {
            return 'Molchat Doma';
        }

        //Verifica títulos mais consagrados do que o crédito no artista
        //       Doces Bárbaros         //Psicopretas
        if (release.id == 9299219 || release.id == 13770359) {
            return release.title;
        }

        //Verifica nomes que exigem substituição (Detalhes de créditos)
        if (release.id == 3696794 || release.id == 4699464) {
            return 'Raul Seixas';
        } else if (release.id == 3677642 || release.id == 1373314) {
            return 'Santa Esmeralda';
        } else if (release.id == 15421432) {
            return 'Tito Madi';
        } else if (release.artists_sort == 'Raimundo Fagner') {
            return 'Fagner';
        }

        //Verifica nomes com algarismos
        if (/^\b\d+\b/.test(release.artists_sort)) {
            var num = release.artists_sort.replace(/^(\b\d+\b).*/, '$1');
            num = ('000000000' + num).slice(-9);
            return release.artists_sort.replace(/^\b\d+\b(.*)/, num + '$1');
        }

        //Verifica Vários e desconhecidos ou trilha sonoras
        if (release.artists_sort == 'Various' || release.artists_sort == 'Unknown Artist' || arrTrilhas.indexOf(Number(release.id)) > 0 || arrNovelas.indexOf(Number(release.id)) > 0 || arrFunk.indexOf(Number(release.id)) > 0) {
            return release.title;
        }

        return release.artists_sort;
    }

    /**
     * @description Separa os compactos para o final da lista
     * @function verificaFormato
     * @param  {Release} release Objeto do release
     * @return {string} Retorna um caractere que tem uma certa prioridade na
     * ordenação para garantir que o álbum vá para a posição desejada
     */
    function verificaFormato(release) {
        /** @type Array<string> */
        var arrFormatos = [];

        release.formats.reduce((a, v) => {
            a.push(v.name);
            if (v.descriptions && v.descriptions.length) {
                v.descriptions.reduce((f, d) => {
                    f.push(d);
                    return f;
                }, a);
            }
            return a;
        }, arrFormatos);

        var formatos = arrFormatos.join();

        if (/7"/.test(formatos) && !/(LP|12")/.test(formatos)) {
            return '~';
        } else {
            return '}';
        }
    }

    /**
     * @description Separa as trilhas sonoras para o critério 2.4
     * @function verificaTrilhaSonora
     * @param  {Release} release Objeto do release
     * @return {string} Retorna um caractere que tem uma certa prioridade na
     * ordenação para garantir que o álbum vá para a posição desejada
     */
    function verificaTrilhaSonora(release) {
        if (arrFunk.indexOf(Number(release.id)) >= 0) {
            return '~|';
        }
        if (arrTrilhas.indexOf(Number(release.id)) >= 0) {
            return '~}';
        } else if (arrNovelas.indexOf(Number(release.id)) >= 0) {
            return '~~' + limpaStr(release.title);
        }

        return '}';
    }

    /**
     * @description Verifica os lançamentos de Vários artistas ou
     * desconhecidos de acordo com o critério 2.2
     * @function verificaVariosDesconhecidos
     * @param  {Release} release Objeto do release
     * @return {string} Retorna um caractere que tem uma certa prioridade na
     * ordenação para garantir que o álbum vá para a posição desejada
     */
    function verificaVariosDesconhecidos(release) {
        //Exceções como álbuns de tributos
        var arrExcecoes = [15421432, 13770359];
        if ((release.artists_sort == 'Various' || release.artists_sort == 'Unknown Artist') && arrExcecoes.indexOf(Number(release.id)) < 0 && arrTrilhas.indexOf(Number(release.id)) < 0 && arrNovelas.indexOf(Number(release.id)) < 0 && arrFunk.indexOf(Number(release.id)) < 0) {
            return '~';
        } else {
            return '}';
        }
    }

    /**
     * @description Compara 2 lançamentos 'a' e 'b' e indica qual deve vir antes na lista.
     * Os critérios devem ser:
     * <ol>
     *   <li>Duas categorias principais, I e II, sendo descritas e ordenadas conforme a seguir:
     *     <ol>
     *       <li>Categoria I: LPs, 12" e 10";</li>
     *       <li>Categoria II: 7".</li>
     *     </ol>
     *   </li>
     *   <li>Categoria I deve ser dividida e ordenada conforme a seguir:
     *     <ol>
     *       <li>Principais: Lançamentos comuns de um artista ou conjunto que não se enquadram nas categorias abaixo;</li>
     *       <li>Vários artistas: Lançamentos comuns que contém vários artistas ou conjuntos ou artistas desconhecidos que não seja álbum de tributo e que não se enquadram nas categorias abaixo;</li>
     *       <li>Compilações: Lançamentos com apanhado de trilhas não inéditas (que pertencem a produtos lançados previamente). Não inclui compilações de conteúdos inéditos nem lançamentos que se enquadram nas categorias abaixo;</li>
     *       <li>Funk Carioca/Miami Bass: Lançamentos que se enquadram no estilo ou gênero de Funk carioca, Rap Freestyle, Miami Bass, Funk melody da primeira e segunda geração, Charme, etc.;</li>
     *       <li>Trilhas sonoras: Lançamentos que compreendem a trilha sonora de uma produção. Deve ser subcategorizado e ordenado como a seguir:
     *         <ol>
     *           <li>Produções: Trilhas de filmes, jogos, séries, programas televisivos, etc;</li>
     *           <li>Novelas: Trilhas de novelas.</li>
     *         </ol>
     *       </li>
     *     </ol>
     *   <li>Todas categorias e subcategorias, exceto quando particularmente especificados, devem obedecer os seguintes critérios:
     *     <ol>
     *       <li>Não deve diferenciar letras maiúsculas de minúsculas;</li>
     *       <li>Não deve diferenciar acentos gráficos e caracteres especiais;</li>
     *       <li>Não deve considerar artigos;</li>
     *       <li>Números devem ser considerados sua ordem de grandeza, não alfabética;</li>
     *       <li>Ordem alfabética de artistas;</li>
     *       <li>Ordem de data de lançamento original do álbum;</li>
     *     </ol>
     *   </li>
     *   <li>Casos particulares são os seguintes:
     *     <ol>
     *       <li>Casos 2.2 em que o lançamento é tão importante, ou seja, quando seu título assume sua própria identidade, devem considerar o título no lugar do artista e serem alocados na categoria 2.1;</li>
     *       <li>Casos 2.4 devem ser ordenados pelo título do album, de acordo com os critérios 3.1 até 3.4</li>
     *     </ol>
     *   </li>
     * </ol>
     * @summary Compara 2 lançamentos de acordo com os critérios estabelecidos
     * @function criterioOrdenacao
     * @param  {Release} a - Álbum 1
     * @param  {Release} b - Álbum 2
     * @return {number}  Retorna -1 se 'a' deve vir antes de 'b', 1 se deve vir depois ou 0 se a posição não deve ser mudada
     */
    function criterioOrdenacao(a, b) {
        var separator = String.fromCharCode(29);

        //monta a string que serve de chave para ordenação
        var auxa = verificaArtistasEspeciais(a) + separator + a.lancamento + separator + a.title;
        var auxb = verificaArtistasEspeciais(b) + separator + b.lancamento + separator + b.title;

        //Limpa a string de caracteres indesejáveis
        auxa = limpaStr(auxa);
        auxb = limpaStr(auxb);

        //Verifica os lançamentos de vários artistas ou desconhecidos
        auxa = verificaVariosDesconhecidos(a) + auxa;
        auxb = verificaVariosDesconhecidos(b) + auxb;

        //Joga as trilha sonoras para o final da lista principal
        auxa = verificaTrilhaSonora(a) + auxa;
        auxb = verificaTrilhaSonora(b) + auxb;

        //Se o formato for compacto joga para o final da lista
        auxa = verificaFormato(a) + auxa;
        auxb = verificaFormato(b) + auxb;

        if (auxa < auxb) {
            return -1;
        } else if (auxa > auxb) {
            return 1;
        } else {
            return 0;
        }
    }

    //Ordena a lista
    colecao.sort(criterioOrdenacao);
    return colecao;
};