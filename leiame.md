# LicitaWatch - Monitor de Licitações [:us:](readme.md)

**LicitaWatch** é uma ferramenta automatizada para raspagem e análise de documentos de licitação pública, projetada para monitorar, extrair e processar dados de licitações em andamento, concluídas e suspensas. Utilizando **AWS Step Functions**, orquestra todo o processo, desde a coleta de links até a extração de dados de diversos formatos de documentos.

## Tabela de Conteúdos

- [Descrição do Projeto](#descrição-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

## Descrição do Projeto

**LicitaWatch** automatiza o monitoramento de licitações públicas em sites municipais. Ele realiza a raspagem de páginas de licitações, verifica os detalhes e extrai informações de documentos anexados, como PDFs e DOCXs. Após o processamento, retorna um JSON com os dados extraídos, facilitando o acesso e a análise.

O projeto visa ser uma solução de baixo custo, utilizando serviços serverless da AWS, como Lambda, Step Functions e S3, permitindo uma execução eficiente e escalável.

## Funcionalidades

- **Monitoramento Automático**: Raspa sites de licitações e coleta links de licitações em andamento, concluídas e suspensas.
- **Processamento de Documentos**: Extrai informações de vários formatos de arquivo, como PDF, DOCX, ZIP, CSV, etc.
- **Retorno de Dados**: Retorna um JSON consolidado com as informações extraídas, como:
  - Nome da licitação
  - Status (em andamento, suspensa, concluída)
  - Data e local da licitação
  - Empresas participantes e suas propostas
  - Documentos anexados e seus conteúdos
- **Armazenamento Temporário**: Armazena arquivos temporariamente no **S3** para processamento.

## Tecnologias Utilizadas

- **AWS Step Functions**: Orquestra o fluxo de trabalho de raspagem, processamento e retorno de dados.
- **AWS Lambda**: Executa tarefas individuais, como raspagem, download e processamento de arquivos.
- **AWS S3**: Armazenamento temporário para arquivos baixados.
- **API Gateway**: Conecta o front-end com a infraestrutura da AWS.
- **Node.js** com bibliotecas como **axios**, **cheerio** e **pdf-parse**: Usado para a raspagem e análise de dados no backend.
- **HTML + JavaScript**: Interface simples para acionar o processo através de uma página web.

## Como Usar

### Pré-requisitos

- **Conta AWS** com permissões para criar e utilizar serviços como Step Functions, Lambda, S3 e API Gateway.
- **Node.js** e **npm** instalados localmente para rodar o front-end.
- **AWS CLI** configurado para a implantação dos recursos AWS.

### Passos

1. **Clonar o Repositório**

   ```bash
   git clone https://github.com/yourusername/LicitaWatch.git
   cd LicitaWatch
   ```

2. **Implantar Recursos AWS**

   Siga os scripts de implantação na pasta `infrastructure` para criar os serviços AWS (Step Functions, Lambda, S3 e API Gateway).

3. **Configurar o Front-end**

   Dentro da pasta `frontend`, instale as dependências e inicie o servidor local:

   ```bash
   npm install
   npm start
   ```

4. **Iniciar o Processo de Monitoramento**

   Acesse a página front-end local e clique no botão "Iniciar Processo de Licitação". Isso acionará o fluxo de trabalho Step Functions, que monitorará as licitações e retornará o JSON com os dados.

## Como Contribuir

1. Faça um fork do repositório
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`)
3. Faça as alterações necessárias
4. Envie um pull request

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE).