// server.js

// Importa as dependências necessárias
const express = require('express');
const mysql = require('mysql2/promise'); // Usamos a versão com Promises do mysql2
// O bcryptjs foi removido
const jwt = require('jsonwebtoken'); // Para gerar tokens JWT no login

// Configurações da aplicação Express
const app = express();
app.use(express.json()); // Middleware para parsear o corpo das requisições como JSON

// ---- ATENÇÃO: Configurações diretamente no código (NÃO RECOMENDADO PARA PRODUÇÃO) ----
// Substitua pelos seus dados reais do MySQL
const dbConfig = {
    host: 'localhost',         // Host do seu MySQL (ex: 'localhost' ou IP)
    user: 'root',              // Usuário do MySQL
    password: 'root', // Senha do seu usuário MySQL
    database: 'SportMax',      // Nome do banco de dados conforme seu script SQL
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const JWT_SECRET = 'seu_segredo_jwt_super_simples_para_poc'; // Mude isso para algo seu, mesmo para PoC
const PORT = 3000; // Porta em que o servidor vai rodar
// ---- FIM DAS CONFIGURAÇÕES ----

// Cria um pool de conexões com o MySQL
let pool;
try {
    pool = mysql.createPool(dbConfig);
    console.log(`Conectado ao banco de dados MySQL (${dbConfig.database}) com sucesso!`);
} catch (error) {
    console.error('Erro ao conectar com o banco de dados MySQL:', error.message);
    console.error('Verifique se o servidor MySQL está rodando e as credenciais em dbConfig estão corretas.');
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
}

// ---- Rotas da API ----

// Rota de Cadastro (POST /register)
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, cpf } = req.body; // 'senha' é usado no lugar de 'password'

    // Validação essencial mínima
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        // Verifica se o email já existe no banco de dados
        const [existingUsers] = await pool.query('SELECT IdUsuario FROM cadastro WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Este email já está cadastrado.' }); // 409 Conflict
        }

        // ATENÇÃO: Senha está sendo salva em TEXTO PLANO. NÃO FAÇA ISSO EM PRODUÇÃO!
        const plainSenha = senha;

        // Insere o novo usuário no banco de dados
        // Se cpf não for fornecido, será inserido como NULL
        const [result] = await pool.query(
            'INSERT INTO cadastro (nome, email, senha, cpf) VALUES (?, ?, ?, ?)',
            [nome, email, plainSenha, cpf || null] // Salva a senha em texto plano
        );

        // Retorna uma resposta de sucesso
        res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            IdUsuario: result.insertId // ID do usuário inserido
        });

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao tentar registrar.' });
    }
});

// Rota de Login (POST /login)
app.post('/login', async (req, res) => {
    const { email, senha } = req.body; // 'senha' é usado no lugar de 'password'

    // Validação essencial mínima
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // Busca o usuário pelo email na tabela 'cadastro'
        const [users] = await pool.query('SELECT IdUsuario, email, senha FROM cadastro WHERE email = ?', [email]);

        if (users.length === 0) {
            // Usuário não encontrado
            return res.status(401).json({ message: 'Email ou senha inválidos.' }); // 401 Unauthorized
        }

        const user = users[0];

        // ATENÇÃO: Comparando senha em TEXTO PLANO. NÃO FAÇA ISSO EM PRODUÇÃO!
        // Compara a senha fornecida com a 'senha' do banco de dados
        const isSenhaMatch = (senha === user.senha);

        if (!isSenhaMatch) {
            // Senha incorreta
            return res.status(401).json({ message: 'Email ou senha inválidos.' });
        }

        // Se a senha estiver correta, gera um token JWT
        const token = jwt.sign(
            { IdUsuario: user.IdUsuario, email: user.email }, // Usa IdUsuario no payload do token
            JWT_SECRET,
            { expiresIn: '1h' } // O token expira em 1 hora
        );

        // Retorna o token para o cliente
        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            IdUsuario: user.IdUsuario // Retorna IdUsuario
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ message: 'Erro interno no servidor ao tentar fazer login.' });
    }
});

// ---- Inicialização do Servidor ----
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Endpoints disponíveis:`);
    console.log(`  POST /cadastro - Cadastra usuário na tabela 'cadastro'`);
    console.log(`  POST /login    - Efetua login com base na tabela 'cadastro'`);
});

// Graceful shutdown
async function closeGracefully(signal) {
    console.log(`\nRecebido ${signal}. Fechando pool de conexões do MySQL...`);
    try {
        if (pool) {
            await pool.end();
            console.log('Pool de conexões do MySQL fechado.');
        }
    } catch (err) {
        console.error('Erro ao fechar o pool de conexões do MySQL:', err);
    } finally {
        process.exit(0);
    }
}

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));
