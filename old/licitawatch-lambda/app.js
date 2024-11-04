const fs = require('fs');
const path = require('path'); // Para facilitar o manuseio de caminhos

// Configuração global para o modo desenvolvedor
const config = {
    isDevMode: true,
    isDesignerMode: false,
    dataDir: path.join(__dirname, 'data'), // Diretório com arquivos dados armazenados em formato JSON
};

async function startProcess(button) {

    // Mostra o loader
    document.getElementById("loader").style.display = "block";
    button.textContent = "Recarregar Licitações";

    try {
      // Faz a requisição para o Lambda
      const response = await fetch(
        "https://mgmqpzyhdrp7ncl3hg7lymqm2q0psqno.lambda-url.us-east-1.on.aws/",
        {
          method: "POST",
        }
      );

      const result = await response.json();

      // Esconde o loader após receber o resultado
      document.getElementById("loader").style.display = "none";

      // Verifica se o resultado contém dados
      if (result && result.length > 0) {
        // Pega o elemento <ul> para inserir os links
        const ul = document.getElementById("secretaria-list");
        ul.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

        // Percorre o JSON retornado
        result.forEach((item) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = item.link;
          a.textContent = item.secretaria;
          a.onclick = function() {
            secretariaSelected(event, item.link, item.secretaria);
        };
          li.appendChild(a);
          ul.appendChild(li); // Adiciona cada <li> com <a> à lista
        });
      }

      // Exibe o resultado no console (opcional)
      console.log("Process completed:", result);
    } catch (error) {
      // Esconde o loader em caso de erro
      document.getElementById("loader").style.display = "none";

      // Lida com erros
      console.error("Erro ao iniciar o processo:", error);
    }
  }

  // Captura a secretaria selecionada e a url da licitação
  function secretariaSelected(event, link, secretaria) {
    event.preventDefault();
    const url = event.target.href; // Obtém a URL da licitação

    document.getElementById("secretaria-title").textContent = secretaria; // Atualiza o título da secretaria
    
    console.log("URL clicada:", url); // Exibe a URL no console
  }