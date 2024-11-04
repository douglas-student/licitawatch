const { handler } = require('./extractLicitacaoHTML');

const event = {
    url: 'https://niteroi.rj.gov.br/licitacao-fesaude-2024/' // URL de teste
};

handler(event).then(response => {
    console.log('Resultado:', JSON.parse(response.body));
}).catch(error => {
    console.error('Erro:', error);
});
