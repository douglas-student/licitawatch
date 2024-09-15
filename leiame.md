# LicitaWatch - Monitor de Licitações [:us:](readme.md)

**LicitaWatch** é uma ferramenta automatizada de scraping e análise de documentos licitatórios, projetada para monitorar, extrair e processar dados de licitações em andamento, concluídas e suspensas. Utilizando o poder das **AWS Step Functions**, ela orquestra todo o processo, desde a coleta de links até a extração de dados de documentos em diferentes formatos.

## Índice

- [Descrição do Projeto](#descrição-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)
- [Como Contribuir](#como-contribuir)
- [Licença](#licença)

## Descrição do Projeto

**LicitaWatch** automatiza o processo de monitoramento de licitações em sites de prefeituras. Ele realiza scraping de páginas de licitações, verifica os detalhes e extrai informações de documentos anexos, como PDFs, DOCXs, CSVs, e mais. Após o processamento, retorna um JSON com os dados extraídos, facilitando o acesso e a análise.

O projeto visa ser uma solução de baixo custo utilizando serviços serverless da AWS, como Lambda, Step Functions, e S3, permitindo uma execução eficiente e escalável.

## Funcionalidades

- **Monitoramento Automático**: Faz scraping de sites de licitações e coleta links de licitações em andamento, concluídas e suspensas.
- **Processamento de Documentos**: Extrai informações de diferentes formatos de arquivos, como PDF, DOCX, ZIP, CSV, entre outros.
- **Retorno de Dados**: Retorna um JSON consolidado com todas as informações extraídas, como:
  - Nome da licitação
  - Status (em andamento, suspensa, concluída)
  - Data e local da licitação
  - Empresas participantes e suas propostas
  - Arquivos anexos e seus conteúdos
- **Armazenamento Temporário**: Armazena temporariamente os arquivos em **S3** para processamento.

## Tecnologias Utilizadas

- **AWS Step Functions**: Orquestração do fluxo de scraping, processamento e retorno dos dados.
- **AWS Lambda**: Execução de tarefas individuais, como scraping, download e processamento de arquivos.
- **AWS S3**: Armazenamento temporário de arquivos baixados.
- **API Gateway**: Conexão entre o front-end e a infraestrutura da AWS.
- **HTML + JavaScript**: Interface simples para disparar o processo via uma página web.
- **Bibliotecas de Python**: Para processamento de arquivos, como `PyPDF2`, `python-docx`, e `pandas`.

## Como Usar

### Pré-requisitos

- **Conta AWS** com permissões para criar e utilizar serviços como Step Functions, Lambda, S3 e API Gateway.
- **Node.js** e **npm** instalados localmente para rodar o front-end.
- **AWS CLI** configurado para implantação de recursos AWS.

### Passos

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/seuusuario/LicitaWatch.git
   cd LicitaWatch
   ```

2. **Implante os Recursos AWS**

   Siga os scripts de deployment fornecidos na pasta `infrastructure` para criar os serviços na AWS (Step Functions, Lambda, S3 e API Gateway).

3. **Configure o Front-end**

   Dentro da pasta `frontend`, instale as dependências e inicie o servidor local:

   ```bash
   npm install
   npm start
   ```

4. **Inicie o Processo de Monitoramento**

   Acesse a página local do front-end e clique no botão "Iniciar Processo de Licitação". Isso acionará o workflow da Step Functions, que monitorará as licitações e retornará o JSON com os dados.

## Como Contribuir

1. Faça um fork do repositório
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`)
3. Faça as alterações necessárias
4. Envie um pull request

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).