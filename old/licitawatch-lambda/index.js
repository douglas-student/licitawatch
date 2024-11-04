const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
    try {
        // URL do site da prefeitura
        const url = 'https://niteroi.rj.gov.br/licitacoes/';

        // Fazendo a requisição HTTP para buscar a página
        const { data } = await axios.get(url);

        // Carregando o HTML da página com cheerio
        const $ = cheerio.load(data);

        // Extraindo todos os links de licitações
        let licitacaoLinks = [];
        $('a').each((index, element) => {
            const link = $(element).attr('href');
            if (link && link.includes('licitacao')) {
                licitacaoLinks.push(link);
            }
        });

        // Retornando os links extraídos
        return {
            statusCode: 200,
            body: JSON.stringify(licitacaoLinks),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: `Error: ${error.message}`,
        };
    }
};
