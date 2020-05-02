//Esse arquivo server para Criar a Conexão com o Banco de Dados

const mysql = require('mysql2');

//Criação de Autentição com AWS(O AWS Cognito é um serviço da AWS de autenticação de usuários)
var pool = mysql.createPool({
    "user" : process.env.MYSQL_USER,
    "password" : process.env.MYSQL_PASSWORD,
    "database" : process.env.MYSQL_DATABASE,
    "host" : process.env.MYSQL_HOST,
    "port" : process.env.MYSQL_PORT
});

exports.pool = pool;

//