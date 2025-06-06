Como Rodar a API Node.js com MySQL (Repositório Pronto)
Este guia explica como executar a API Node.js/Express, assumindo que você já possui o código-fonte da API (a pasta api contendo server.js e package.json) baixado ou clonado. O foco é na configuração do banco de dados e nos comandos para iniciar e testar a API.

1. Pré-requisitos Essenciais
Antes de continuar, garanta que você tem:

Node.js e npm:

Necessários para executar a API. Se não os tiver, baixe em nodejs.org.

Verifique as versões no terminal:

node -v
npm -v

Servidor MySQL:

Um servidor MySQL deve estar em execução e acessível.

2. Configuração do Ambiente
Mesmo com o repositório pronto, alguns passos de configuração são cruciais:

Crie o Banco de Dados e a Tabela cadastro no MySQL:

Este passo é obrigatório. A API precisa que o banco SportMax e a tabela cadastro existam.

Acesse seu servidor MySQL (via MySQL Workbench, DBeaver, linha de comando, etc.).

Execute o seguinte script SQL:

-- Cria o banco de dados se ele não existir
CREATE DATABASE IF NOT EXISTS SportMax;

-- Seleciona o banco de dados para uso
USE SportMax;

-- Cria a tabela de cadastro
CREATE TABLE IF NOT EXISTS cadastro(
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR (100) NOT NULL,
    email VARCHAR (110) NOT NULL UNIQUE,
    senha VARCHAR(60) NOT NULL, -- Lembre-se: senha em texto plano no código atual!
    cpf VARCHAR (11)
);

Atenção: O código da API fornecido armazena senhas em texto plano. Isto não é seguro para produção.

Configure as Credenciais da API (api/server.js):

Navegue até a pasta api do seu projeto.

Abra o ficheiro server.js.

Localize e atualize a secção dbConfig com os dados de acesso ao seu MySQL:

const dbConfig = {
    host: 'localhost',         // Ou o IP/hostname do seu servidor MySQL
    user: 'seu_usuario_mysql', // Seu usuário do MySQL (ex: 'root')
    password: 'sua_senha_mysql', // Sua senha do MySQL
    database: 'SportMax',      // Deve ser 'SportMax'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const JWT_SECRET = 'altere_para_um_segredo_forte_e_unico'; // Mude isto!

Substitua 'seu_usuario_mysql' e 'sua_senha_mysql' pelos seus dados reais.

Altere o JWT_SECRET para uma string longa, aleatória e secreta.

Instale as Dependências (Se necessário):

O repositório já deve ter o package.json listando as dependências (express, mysql2, jsonwebtoken).

Se for a primeira vez que você está configurando este projeto em um novo ambiente, ou se a pasta node_modules não existir dentro de api, você precisará instalar as dependências.

No terminal, dentro da pasta api, execute:

cd api
npm install

3. Executar a API
Inicie o Servidor:

No terminal, certifique-se de que você está dentro da pasta api:

cd api

Execute o comando para iniciar o servidor Node.js:

node server.js

Verifique a Saída no Terminal:

Se tudo estiver correto, você verá mensagens indicando que o servidor está rodando e conectado ao banco SportMax, juntamente com os avisos sobre o armazenamento de senhas em texto plano:

Conectado ao banco de dados MySQL (SportMax) com sucesso!
Servidor rodando na porta 3000
Endpoints disponíveis:
  POST /cadastro - Cadastra usuário na tabela 'cadastro'
  POST /login    - Efetua login com base na tabela 'cadastro'

Se ocorrer um erro como ECONNREFUSED, verifique se o servidor MySQL está ativo e se as credenciais no dbConfig do server.js estão corretas.

4. Testar a API
Com o servidor em execução, você pode testar os endpoints (disponíveis em http://localhost:3000) usando ferramentas como Postman, Insomnia ou curl.

Endpoint de Cadastro (POST /cadastro)

URL: http://localhost:3000/cadastro

Método: POST

Cabeçalhos (Headers): Content-Type: application/json

Corpo (Body - JSON raw):

{
    "nome": "Nome Teste",
    "email": "email@teste.com",
    "senha": "senha123",
    "cpf": "11122233344"
}

Endpoint de Login (POST /login)

URL: http://localhost:3000/login

Método: POST

Cabeçalhos (Headers): Content-Type: application/json

Corpo (Body - JSON raw):

{
    "email": "email@teste.com",
    "senha": "senha123"
}

Seguindo estes passos, você deverá conseguir executar e testar a API.