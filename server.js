const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');  // Para baixar os arquivos com mais flexibilidade
const listEndpoints = require('express-list-endpoints');

const app = express(); // Inicializa o aplicativo Express
app.use(express.json()); // Necessário para processar JSON no body das requisições

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

// **Novas modificações para a extração de dados**
// Importando as novas rotas
const licitacoesRoutes = require('./routes/licitacoes');
app.use('/licitacoes', licitacoesRoutes); // Rota para manipulação de licitações

// Rota para baixar o arquivo PDF
app.post('/baixar-arquivo', async (req, res) => {
  const { link } = req.body;  // Esperando que o link seja enviado no corpo da requisição
  const fileName = link.split('/').pop(); // Pega o nome do arquivo da URL
  const filePath = path.join(__dirname, 'public', 'download', fileName); // Caminho onde o arquivo será salvo

  // Verifica se a pasta 'download' existe, senão cria
  const downloadDir = path.join(__dirname, 'public', 'download');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  try {
    // Baixando o arquivo com o axios
    const response = await axios({
      url: link,
      method: 'GET',
      responseType: 'stream',  // Recebe o arquivo como stream
    });

    // Salvar o arquivo no servidor
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);  // Envia a stream de dados para o arquivo

    writer.on('finish', () => {
      res.status(200).json({ message: 'Arquivo baixado com sucesso', fileName });
    });

    writer.on('error', (err) => {
      res.status(500).json({ message: 'Erro ao baixar o arquivo', error: err.message });
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao baixar o arquivo', error: error.message });
  }
});

// Listar todas as rotas definidas
console.log(listEndpoints(app));

// Configura o servidor para rodar na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
