// Configuração global para o modo desenvolvedor
const config = {
  isDevMode: false,
  isDesignerMode: true,
  dataDir: "/data",
};

async function startProcess(button) {
  // Mostra o loader
  document.getElementById("loader").style.display = "block";
  button.textContent = "Recarregar Licitações";

  try {
      let data;

      // Verifica se o modo Designer está ativado
      if (config.isDesignerMode) {
          // Carrega o arquivo JSON local
          const response = await fetch(`${config.dataDir}/links-secretarias.json`);
          data = await response.json(); // Carrega o JSON completo
          console.log("Dados carregados do JSON local:", data);
      } else {
          // Faz a requisição para o Lambda
          const response = await fetch("https://mgmqpzyhdrp7ncl3hg7lymqm2q0psqno.lambda-url.us-east-1.on.aws/", {
              method: "POST",
          });

          data = await response.json(); // Carrega o JSON completo da AWS Lambda
          console.log("Dados carregados da Lambda:", data);
      }

      // Esconde o loader após receber o resultado
      document.getElementById("loader").style.display = "none";

      // Verifica se o resultado contém dados
      if (Array.isArray(data) && data.length > 0) {
          // Pega o elemento <ul> para inserir os links
          const ul = document.getElementById("secretaria-list");
          ul.innerHTML = ""; // Limpa a lista antes de adicionar novos itens

          // Percorre o JSON retornado
          data.forEach((item) => {
              console.log("Adicionando item:", item); // Log do item que está sendo adicionado
              const li = document.createElement("li");
              const a = document.createElement("a");
              a.href = item.link;
              a.textContent = item.secretaria;
              a.onclick = function(event) {
                  secretariaSelected(event, item.link, item.secretaria);
              };
              li.appendChild(a);
              ul.appendChild(li); // Adiciona cada <li> com <a> à lista
          });
      } else {
          console.log("Resultado inválido ou vazio:", data); // Log do resultado
      }
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
