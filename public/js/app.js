// Configuração global para o modo desenvolvedor
const config = {
    isDevMode: false,
    isDesignerMode: true,
    dataDir: "/data",
    localApiUrl: "http://localhost:3000", // URL local da API
};

// Captura a seleção do motor de análise
const engineSelect = document.getElementById("engine"); // Constante para o select

async function startProcess(button) {
    // Atualiza a variável selectedEngine toda vez que a função é chamada
    const selectedEngine = engineSelect.value; // Variável que armazena o motor selecionado
    console.log("Motor de análise selecionado:", selectedEngine);

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
            // Verifica o motor selecionado
            if (selectedEngine === "parametrica") {
                // Chama a função Lambda local
                const response = await fetch(`${config.localApiUrl}/extract-links`, {
                    method: "POST",
                });
                data = await response.json(); // Carrega o JSON completo da Lambda local
                console.log("Dados carregados da Lambda local:", data);
            } else if (selectedEngine === "ia-aws") {
                // Faz a requisição para a Lambda na AWS
                const response = await fetch("https://mgmqpzyhdrp7ncl3hg7lymqm2q0psqno.lambda-url.us-east-1.on.aws/", {
                    method: "POST",
                });
                data = await response.json(); // Carrega o JSON completo da AWS Lambda
                console.log("Dados carregados da Lambda AWS:", data);
            } else if (selectedEngine === "ia-chatgpt") {
                // Faz a requisição para a Lambda que usa o ChatGPT
                const response = await fetch("https://your-chatgpt-lambda-url.amazonaws.com/dev", {
                    method: "POST",
                });
                data = await response.json(); // Carrega o JSON completo da AWS Lambda com ChatGPT
                console.log("Dados carregados da Lambda ChatGPT:", data);
            }
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
                a.onclick = function (event) {
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
async function secretariaSelected(event, link, secretaria) {
    event.preventDefault();
    const url = event.target.href; // Obtém a URL da licitação

    document.getElementById("secretaria-title").textContent = secretaria; // Atualiza o título da secretaria

    console.log("URL clicada:", url); // Exibe a URL no console

    if (config.isDesignerMode) {
        try {
            // Carregar os dados do arquivo JSON
            const response = await fetch(`${config.dataDir}/licitacoes-examples.json`); // Use config.dataDir
            const licitacoes = await response.json();

            // Selecionar o div de conteúdo
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpa o conteúdo anterior

            // Carregar o template do card
            const cardResponse = await fetch('/views/partials/card-licitacao.html');
            const cardTemplate = await cardResponse.text();

            // Gerar o HTML para cada licitação
            licitacoes.forEach(item => {
                const licitacao = item.licitacao;

                // Substituir placeholders no template pelo conteúdo real
                let cardHTML = cardTemplate
                    .replace(/\{\{tipo\}\}/g, licitacao.tipo)
                    .replace(/\{\{numero\}\}/g, licitacao.numero)
                    .replace(/\{\{data\}\}/g, licitacao.data)
                    .replace(/\{\{hora\}\}/g, licitacao.hora)
                    .replace(/\{\{status\}\}/g, licitacao.status)
                    .replace(/\{\{objeto\}\}/g, licitacao.objeto)
                    .replace(/\{\{reunioes\}\}/g, licitacao.reunioes.map(reuniao => `<a href="${reuniao.link}">${reuniao.plataforma}</a>`).join(', '))
                    .replace(/\{\{arquivos\}\}/g, licitacao.arquivos.map(arquivo => `<li><a href="${arquivo.link}">${arquivo.titulo}</a></li>`).join(''));

                // Adiciona o card ao div de conteúdo
                contentDiv.insertAdjacentHTML('beforeend', cardHTML);
            });
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }
}


async function fetchAndDisplayScrumTeam() {
    try {
        // Chama a função Lambda (para o ambiente local, substitua o endpoint se necessário)
        const response = await fetch('/lambda/enhanceScrumTeamFunction');
        const teamData = await response.json();

        // Exibe o JSON no console
        console.log(teamData);

        // Adiciona o conteúdo na página HTML
        const container = document.createElement('div');
        container.id = 'helloworldtest';

        const list = document.createElement('ul');
        teamData.forEach(member => {
            const listItem = document.createElement('li');
            listItem.textContent = `${member.name} - ${member.role}: ${member.skills}`;
            list.appendChild(listItem);
        });

        container.appendChild(list);
        document.body.appendChild(container);

    } catch (error) {
        console.error('Erro ao buscar e exibir a equipe Scrum:', error);
    }
}

// Chama a função ao carregar a página
// window.onload = fetchAndDisplayScrumTeam;
