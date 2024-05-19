# MKS Backend Challenge

Este repositório contém a solução para o teste de desenvolvedor backend para a MKS. O foco deste projeto é avaliar o conhecimento de back-end com foco em habilidades organizacionais e arquiteturais. A tarefa é criar uma API Nodejs para um aplicativo de catálogo de filmes.

## Desafio

O desafio consiste em criar uma API RESTful JSON, que consistem em um CRUD de filmes e clientes. Além disso, é necessário implementar um sistema de cache para visualização dos mesmos.

## Solução

Em resposta ao desafio proposto, todas as funcionalidades requisitadas foram implementadas e testadas com sucesso. Para otimizar o desempenho e aproveitar os benefícios do armazenamento distribuído oferecido pelo Redis, optei por implementar duas instâncias da aplicação por trás de um balanceador de carga (Nginx).

Com exceção das rotas de login e registro, todas as demais rotas exigem autenticação através de um token JWT no formato Bearer: token. Para garantir o acesso seguro, certifique-se de incluir este token no cabeçalho de autorização ao realizar qualquer requisição.

## Tecnologias

- **Linguagem de Programação**: TypeScript (Node.js 20.x) com o framework NestJS
- **Banco de Dados**: Postgres (Persistência de dados) + Redis (Cache)
- **Containerização**: Docker + Docker compose
- **Bibliotecas**: TypeORM, Jest
- **Ferramentas**: Nginx (Load Balancer)
- **Documentação**: Swagger

## Deploy

O deploy da aplicação foi feito em uma VM na GCP (Google Cloud Platform) e o endpoint é: [API MKS](http://35.199.123.49:9999/api/v1/docs)

## Rodando localmente

Para executar a aplicação localmente, siga os passos:

0. Antes de tudo copie os valores da .env.example para um arquivo .env:
    ```bash
    cp .env.example .env
    ```
1. Clone o repositório: 
    ```bash
    git clone git@github.com:thales-sz/mks-backend-challenge.git
    ```
2. Navegue até o diretório:
    ```bash
    cd mks-backend-challenge
    ```
3. Certifique-se de usar a versão mais recente:
    ```bash
    git pull origin main
    ```
4. Execute:
    ```bash
   docker compose up --build
    ```

Para executar os testes, no diretório raiz execute:
   ```bash
   npm run test
  ```

Ou para coverage:
  ```bash
    npm run test:cov
  ```

**Não se esqueça de atualizar o arquivo .env com as credenciais corretas**

Ao executar esses comandos, o programa trará 5 containers docker, 2 instâncias da aplicação rodando na porta 3030, um balanceador de carga nginx na porta 9999, os bancos de dados postgres e redis.

Todas as solicitações à API devem ser feitas diretamente ao balanceador de carga Nginx na porta **9999**

## Documentação

O app possui uma documentação feita com o Swagger: 

- Local: `http://localhost:9999/api/v1/docs`
- Deploy: `http://35.199.123.49:9999/api/v1/docs`

## Notas

- Sinta-se à vontade para qualquer dúvida em: thales.souz@outlook.com
- Obrigado pela oportunidade!

## License

This project is licensed under the [MIT License](LICENSE).