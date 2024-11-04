const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async () => {
  const baseURL = 'https://niteroi.rj.gov.br/category/licitacao-em-andamento/';
  let allLinks = new Set(); // Armazena os links sem duplicatas
  let nextPage = baseURL;

  try {
    while (nextPage) {
      // Faz a requisição da página
      const { data } = await axios.get(nextPage);
      const $ = cheerio.load(data);

      // Extração dos links e secretarias
      $('.post-element').each((_, element) => {
        const secretaria = $(element).find('h2.entry-title').text().trim();
        const link = $(element).find('h2.entry-title a').attr('href');

        // Filtra links que não contenham '/category/' ou navegação
        if (link && !link.includes('/category/') && !link.includes('avisos') && !link.includes('dispensa')) {
          allLinks.add(JSON.stringify({ secretaria, link }));
        }
      });

      // Verifica se existe uma próxima página
      const nextLink = $('a[href*="/page/"]:contains("Próxima")').attr('href');
      nextPage = nextLink ? nextLink : null; // Se houver, continua para a próxima página
    }

    // Converte o Set em array e retorna a resposta
    const response = Array.from(allLinks).map(item => JSON.parse(item));
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao processar os dados' }),
    };
  }
};
