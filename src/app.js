const express = require('express');
const app = express();
//Importando routes
const routes = require('./routes');
//importando o morgan
const morgan = require('morgan');

 //importando body-parse
//const bodyParser = require('body-parser');

//importar módulo de Segurança (cors)
const cors = require('cors');


//Metodo de Teste 
/*
app.use((request, respons, next) => {
    respons.status(200).send({
        mensagem: 'OK,Deu certo'
    });
});

OU

app.use('/teste', (request, respons, next) => {
    respons.status(200).send({
        mensagem: 'OK,Deu certo'
    });
});

*/




//Agora começa



// Morgan
//Dentro dos () do morgan podemos colocar : dev, combined, tiny... Dependendo da informação q queremos q apareça
// e ainda tem o padrão personalizado : app.use(morgan(":method :url :response-time"))
app.use(morgan('dev'));
//




// Body Parser
  //app.use(bodyParser.urlencoded({ extended: false}));  // significa que vai aceitar apenas dados simples
  //app.use(bodyParser.json()); // significa que só vai aceitar formato JSON de entrada

//Sem Importar Body Parser
//Nós Temos q informar para o app(express) que estaremos a usar JSON para as Request Body
app.use(express.json());

//Serve para express também lidar com requisições URLENCODED (Facilita Upload de arquivos) 
app.use(express.urlencoded({ extended: true }));

//Usar rotas do arquivo routes.js
app.use(routes);

//




//CORS
//Por estarmos ainda em desenvolvimento colocamos Desse jeito, assim permite que todas Aplicações front-end possam acessar o back-end
app.use(cors());
//
/*
app.use((request, respons, next) => {
    respons.header('Access-Control-Allow-Origin', '*');
    respons.header(
        'Access-Control-Allow-Origin', 
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );

    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return response.status(200).send({});
    }

    next();
})
*/
//



// Podemos trocar esse Tratamento de Erros pelo Celebrate
//
//Tratamento para quando o Morgan não encontrou nenhuma rota depois de passar pelas de cima
//Quando não encontra rota, entra aqui:
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

//Tratamento de erro
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return this.response.send({
        erro: {
            mensagem: error.message
        }
    });
});
//

module.exports = app;