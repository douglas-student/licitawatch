const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event) => {
    const { url } = event; // Recebe a URL via o corpo da requisição ou como parâmetro no event
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'URL não fornecida.' })
        };
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const licitacoes = [];

        // Seleciona todas as tags <article> que contêm as licitações
        $('article').each((index, element) => {
            const licitacao = {};

            // Extrair número do pregão ou licitação (ajuste seletor conforme estrutura)
            licitacao.Número = $(element).find('.numero').text().trim() || null;

            // Extrair objeto
            licitacao.Objeto = $(element).find('.objeto').text().trim() || null;

            // Extrair motivo
            licitacao.Motivo = $(element).find('.motivo').text().trim() || null;

            // Extrair data
            licitacao.Data = $(element).find('.data').text().trim() || null;

            // Extrair hora
            licitacao.Hora = $(element).find('.hora').text().trim() || null;

            // Extrair local
            licitacao.Local = $(element).find('.local').text().trim() || $(element).find('.local a').attr('href') || null;

            // Extrair processo
            licitacao.Processo = $(element).find('.processo').text().trim() || null;

            // Extrair links de arquivos
            licitacao.Url_files = [];
            $(element).find('.arquivos a').each((i, el) => {
                const fileLink = $(el).attr('href');
                if (fileLink) licitacao.Url_files.push(fileLink.trim());
            });

            // Extrair outros links
            licitacao.Others_links = [];
            $(element).find('.outros-links a').each((i, el) => {
                const otherLink = $(el).attr('href');
                if (otherLink) licitacao.Others_links.push(otherLink.trim());
            });

            licitacoes.push(licitacao);
        });

        return {
            statusCode: 200,
            body: JSON.stringify(licitacoes, null, 2) // Retorna os dados formatados como JSON
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro ao buscar a URL.', error: error.message })
        };
    }
};
