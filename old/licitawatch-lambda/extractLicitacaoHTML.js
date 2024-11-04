const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
    const url = event.url; // A URL será passada no evento
    try {
        // Fazendo a requisição HTTP para obter o HTML da página
        const response = await axios.get(url);
        const html = response.data;

        // Calcula o tamanho do HTML original em bytes
        const originalSize = Buffer.byteLength(html, 'utf8');

        // Carregar o HTML no Cheerio para manipulação
        const $ = cheerio.load(html);

        // Extraindo a tag <article>
        const articles = $('article').map((i, el) => {
            return $(el).html(); // Extrai o HTML interno de cada <article>
        }).get();

        // Juntando todas as tags <article> em uma única string de HTML
        let articlesHTML = articles.join('');

        // Remover todo o conteúdo entre as tags <script> e </script>
        const cleanedHTML = articlesHTML.replace(/<script[\s\S]*?<\/script>/gi, '')
                                        .replace(/\n/g, '')  // Remover quebras de linha
                                        .replace(/\t/g, ''); // Remover tabulações

        // Calcula o tamanho do HTML limpo em bytes
        const cleanedSize = Buffer.byteLength(cleanedHTML, 'utf8');

        // Retorna o HTML limpo das tags <article> e os tamanhos
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Extração e limpeza realizadas com sucesso',
                originalSize: originalSize,   // Tamanho do HTML original
                cleanedSize: cleanedSize,     // Tamanho do HTML limpo
                cleanedHTML: cleanedHTML
            }),
        };
    } catch (error) {
        console.error('Erro ao extrair e limpar a tag <article>: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Erro ao extrair e limpar a tag <article>',
                error: error.message
            }),
        };
    }
};
