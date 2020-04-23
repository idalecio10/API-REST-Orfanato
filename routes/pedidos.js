const express = require('express');
const router = express.Router();


//RETORNA TODOS OS PEDIDOS
router.get('/', (request, response, next) => {
    response.status(200).send({
        mensagem: 'Retorna os Pedidos'
    });
});


//INSERE UM PEDIDO
router.post('/', (request, response, next) =>{
    // Exemplo do Body-Parser
    const pedido = {
        ip_produto: request.body.id_produto,
        quantidade: request.body.quantidade
    };
    //

    response.status(201).send({
        mensagem: 'O Pedido foi criado',
        //Continuação Body-Parser
        pedidoCriado : pedido
        //
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (request, response, next) => {
    const id = request.params.id_pedido
    response.status(200).send({
        mensagem: 'Detalhes do Pedido',
        id: id
    });
});

//ALTERA UM PEDIDO
/*
router.patch('/', (request, response, next) =>{
    response.status(201).send({
        mensagem: 'Usando o Patch dentro da rota de Pedidos'
    });
});
*/

//EXCLUI UM PEDIDO
router.delete('/', (request, response, next) =>{
    response.status(201).send({
        mensagem: 'Pedido Excluido'
    });
});


module.exports = router;