// Carregar a função Lambda
const { handler } = require('./extractLicitacoesFunction');

// Definir a URL que você deseja testar
const event = {
    url: 'https://niteroi.rj.gov.br/licitacao-fms-2024/' // Substitua pela URL real
};

// Executar a função Lambda localmente
handler(event).then(response => {
    console.log('Resultado:', JSON.parse(response.body)); // Exibir o resultado no console
}).catch(error => {
    console.error('Erro:', error);
});
