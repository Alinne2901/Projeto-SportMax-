<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "SportMax";

// Conectar ao banco
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Pegar dados do formulário
$email = $_POST['email'];
$senha = $_POST['senha'];
$confirma = $_POST['confirma_senha'];
$cpf = $_POST['cpf'];

// Verificar se senha confere
if ($senha !== $confirma) {
    die("Erro: As senhas não coincidem.");
}

// Criptografar a senha
$senha_cripto = password_hash($senha, PASSWORD_DEFAULT);

// Inserir no banco com segurança
$stmt = $conn->prepare("INSERT INTO cadastro (email, senha, cpf) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $email, $senha_cripto, $cpf);

if ($stmt->execute()) {
    echo "✅ Cadastro realizado com sucesso!";
} else {
    echo "Erro: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
