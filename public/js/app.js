// Configuração global para o modo desenvolvedor
const config = {
    isDevMode: false,
    isDesignerMode: true,
    dataDir: "/data",
    localApiUrl: "http://localhost:3000", // URL local da API
};

function initializePopovers() {
    document.querySelectorAll('.btn-popover').forEach(popoverTriggerEl => {
        new bootstrap.Popover(popoverTriggerEl, {
            container: 'body',
            boundary: 'parent',
            trigger: 'click'
        });
    });
}



// Captura a seleção do motor de análise
const engineSelect = document.getElementById("engine"); // Constante para o select

function analisarTransparencia(licitacoes) {
    return licitacoes.map((item) => {
        const licitacao = item.licitacao;
        const { arquivos, reunioes } = licitacao;

        // Critérios de transparência
        const temEdital = arquivos.some((arquivo) => arquivo.titulo.toLowerCase().includes("edital"));
        const temImpugnacao = arquivos.some((arquivo) => arquivo.titulo.toLowerCase().includes("impugnação"));
        const temResposta = arquivos.some((arquivo) => arquivo.titulo.toLowerCase().includes("resposta"));
        const temLinksValidos = reunioes.every((reuniao) => reuniao.link && reuniao.link.startsWith("http"));

        // Contagem de documentos
        const totalDocumentos = arquivos.length;

        // Definindo o nível de transparência
        let nivelTransparencia = "Baixo";

        if (temEdital && temImpugnacao && temResposta && temLinksValidos && totalDocumentos > 5) {
            nivelTransparencia = "Alto";
        } else if ((temEdital && (temImpugnacao || temResposta)) || totalDocumentos >= 3) {
            nivelTransparencia = "Médio";
        }

        // Retorna o item original com a chave nivelTransparencia adicionada
        return {
            ...item,
            licitacao: {
                ...licitacao,
                nivelTransparencia: nivelTransparencia
            }
        };
    });
}

async function startProcess(button) {
    // Atualiza a variável selectedEngine toda vez que a função é chamada
    const selectedEngine = engineSelect.value; // Variável que armazena o motor selecionado
    console.log("Motor de análise selecionado:", selectedEngine);

    const anoLicitacao = document.getElementById("licitacao").value;

    console.log("Ano Licitação selecionado:", anoLicitacao);

    // Mostra o loader
    document.getElementById("loader").style.display = "block";
    document.getElementById('content').innerHTML = '';
    button.textContent = "Recarregar Licitações";

    try {
        let data;

        // Verifica se o modo Designer está ativado
        if (config.isDesignerMode) {
            let jsonLocal;

            if (anoLicitacao === "em-andamento") {
                jsonLocal = `${config.dataDir}/links-secretarias.json`;
            } else {
                jsonLocal = `${config.dataDir}/links-secretarias-` + anoLicitacao + `.json`;
            }



            // Carrega o arquivo JSON local
            const response = await fetch(jsonLocal);
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

    const anoLicitacao = document.getElementById("licitacao").value;

    if (config.isDesignerMode) {
        let jsonLocal;

        if (anoLicitacao === "em-andamento") {
            jsonLocal = `${config.dataDir}/licitacoes-examples.json`;
        } else {
            jsonLocal = `${config.dataDir}/licitacoes-examples-` + anoLicitacao + `.json`;
        }

        try {
            // Carregar os dados do arquivo JSON
            const response = await fetch(jsonLocal); // Use config.dataDir
            const licitacoes = await response.json();
            const licitacoesNewJson = analisarTransparencia(licitacoes);

            console.log(licitacoesNewJson);

            // Selecionar o div de conteúdo
            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = ''; // Limpa o conteúdo anterior

            // Carregar o template do card
            const cardResponse = await fetch('/views/partials/card-licitacao.html');
            const cardTemplate = await cardResponse.text();

            let idCard = 0;
            // Gerar o HTML para cada licitação
            licitacoesNewJson.forEach(item => {
                const licitacao = item.licitacao;
                console.log(licitacao);
                console.log(licitacao.nivelTransparencia);
                // Substituir placeholders no template pelo conteúdo real
                let newCard = 'card-licitacao-' + idCard++;
                let cardHTML = cardTemplate
                    .replace(/\{\{tipo\}\}/g, licitacao.tipo)
                    .replace(/\{\{id\}\}/g, newCard)
                    .replace(/\{\{json\}\}/g, encodeURIComponent(JSON.stringify(licitacao)))
                    .replace(/\{\{numero\}\}/g, licitacao.numero)
                    .replace(/\{\{data\}\}/g, licitacao.data)
                    .replace(/\{\{hora\}\}/g, licitacao.hora)
                    .replace(/\{\{status\}\}/g, licitacao.status)
                    .replace(/\{\{objeto\}\}/g, licitacao.objeto)
                    .replace(/\{\{nivelTransparencia\}\}/g, licitacao.nivelTransparencia)
                    .replace(/\{\{reunioes\}\}/g, licitacao.reunioes.map(reuniao => `<a href="${reuniao.link}">${reuniao.plataforma}</a>`).join(', '))
                    .replace(/\{\{arquivos\}\}/g, licitacao.arquivos.map(arquivo => `<li><a href="${arquivo.link}">${arquivo.titulo}</a></li>`).join(''));

                // Adiciona o card ao div de conteúdo
                contentDiv.insertAdjacentHTML('beforeend', cardHTML);
                initializePopovers();
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

const scrollableDivContent = document.querySelector('#content');

if (!window.scrollEventAdded) {
    window.addEventListener('scroll', () => {
        // Obtém todos os popovers visíveis
        const popovers = document.querySelectorAll('.popover');
        // Exibe a quantidade de popovers visíveis encontrados
        console.log(`Foram encontrados ${popovers.length} popovers.`);

        // Fecha todos os popovers visíveis
        popovers.forEach(popover => {
            // Verifica se o popover já está visível e, se estiver, fecha
            popover.classList.remove('show');
        });
    });
    // Marca que o evento de scroll já foi adicionado para evitar duplicação
    window.scrollEventAdded = true;
}

async function analiseProfunda() {
    try {

        if (config.isDesignerMode) {
            let licitacoes = await exibirDadosLicitacao();
            console.log(licitacoes);

            const targetDiv = this.getAttribute('dg-target');
            const levelLicitacao = this.getAttribute('dg-nivel-transparencia');
            const targetElement = document.getElementById(targetDiv);
            const divDadosLicitacoes = document.getElementById('dados-licitacao');

            console.log(targetDiv);

            let html = "";
            html += '<div class="card">';
            html += '<div class="card-body">';
            html += '<ul>';
            html += '<li>UASG: ' + licitacoes.uasg + '</li>';
            html += '<li>Data:: ' + licitacoes.dataRealizacao + '</li>';
            html += '<li>Objeto: ' + licitacoes.objeto.descricao + '</li>';
            html += '<li>Valor estimado: ' + formatMoeda(licitacoes.detalhes.valorEstimado) + '</li>';
            html += '<li>Programa Orçamentário: ' + licitacoes.detalhes.programaOrcamentario + '</li>';
            html += '<li>Nível de Transparência: ' + levelLicitacao + '</li>';
            html += '</ul>';
            html += '</div>';
            html += '</div>';

            if (targetElement) {
                targetElement.innerHTML = '';
                targetElement.innerHTML = html;
                targetElement.classList.remove('col-md-4', 'col-lg-6');
                targetElement.classList.add('col-md-4', 'col-lg-6');
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            } else {
                console.error('Elemento com ID "' + targetDiv + '" não encontrado.');
            }
        } else {
            // Pega o JSON armazenado no atributo 'dg-json' do botão
            const meuJson = JSON.parse(decodeURIComponent(this.getAttribute('dg-json')));
            console.log(meuJson);

            // Para cada arquivo PDF listado em meuJson.arquivos, envie o link para o backend
            const arquivosBaixados = await Promise.all(meuJson.arquivos.map(async (arquivo) => {
                // Envia a requisição POST com o link do arquivo
                const response = await fetch('/baixar-arquivo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',  // Define que o conteúdo será JSON
                    },
                    body: JSON.stringify({ link: arquivo.link })  // Passa o link do arquivo como JSON
                });

                if (!response.ok) {
                    throw new Error(`Falha ao baixar o arquivo: ${arquivo.link}`);
                }

                const data = await response.json();
                console.log(`Arquivo baixado: ${data.fileName}`);
                return data;
            }));
        }


    } catch (error) {
        console.error("Erro durante a análise profunda:", error);
    }
}


async function exibirDadosLicitacao() {
    const anoLicitacao = document.getElementById("licitacao").value;
    let jsonLocal;

    if (anoLicitacao === "em-andamento") {
        jsonLocal = `${config.dataDir}/licitacao-extracao-edital-pdf.json`;
    } else {
        jsonLocal = `${config.dataDir}/licitacao-extracao-edital-pdf-` + anoLicitacao + `.json`;
    }
    try {
        const response = await fetch(jsonLocal);
        const licitacoes = await response.json();

        return licitacoes;
    } catch (error) {
        console.error("Erro ao carregar os dados da licitação:", error);
    }
}

function formatMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

