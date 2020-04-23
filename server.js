//(importar funcionalidades http para dentro do node) ou criar serviço http
const http = require('http');

//importando todo o conteudo do app para o server.js
const app = require('./src/app');

//Declarar a porta a ser usada
const port = process.env.PORT || 3333;

//criar variavel que vai armazenar o server, e passa o app
const server = http.createServer(app);


//fazer a aplicaçao (server) ouvir a porta 3333... (localhost:3000)
server.listen(port);


