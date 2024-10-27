const express = require('express');
const path = require('path');

const app = express();

// Rota principal
const routes = require('./routes'); // Carrega as rotas definidas

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Servir arquivos CSS e JS diretamente da pasta 'node_modules'
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));


// Usar as rotas definidas
app.use('/', routes);

// Configura o servidor para rodar na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
