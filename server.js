const express = require('express');
const path = require('path');
const listEndpoints = require('express-list-endpoints');

const app = express(); // Inicializa o aplicativo Express

// Rota principal
const routes = require('./routes'); // Carrega as rotas definidas

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servir arquivos CSS e JS diretamente da pasta 'node_modules'
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

// Usar as rotas definidas
app.use('/', routes);

// Função Lambda para aprimorar equipe Scrum (lambda/enhanceScrumTeamFunction.js)
const { enhanceScrumTeam } = require('./lambda/enhanceScrumTeamFunction');

// Adiciona a rota que chama a função Lambda local
app.get('/lambda/enhanceScrumTeamFunction', async (req, res) => {
  const response = await enhanceScrumTeam();
  res.status(response.statusCode).json(JSON.parse(response.body));
});

// Listar todas as rotas definidas
console.log(listEndpoints(app));

// Configura o servidor para rodar na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
