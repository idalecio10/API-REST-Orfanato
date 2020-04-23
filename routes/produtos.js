const express = require('express');
const router = express.Router();


//RETORNA TODOS OS PRODUTOS
router.get('/', (request, response, next) => {
    response.status(200).send({
        mensagem: 'Retorna todos os Produtos'
    });
});


//INSERE UM PRODUTO
router.post('/', (request, response, next) =>{
    // Exemplo do Body-Parser ou só essa linha app.use(express.json());
    const produto = {
        nome: request.body.nome,
        preco: request.body.preco
    };
    //

    response.status(201).send({
        mensagem: 'Insere um Produto',
        //Continuação Body-Parser ou só essa linha app.use(express.json());
        produtoCriado : produto
        //
    });
});

// RETORNA OS DADOS DE UM PRODUTO
router.get('/:id_produto', (request, response, next) => {
    const id = request.params.id_produto

    if (id === 'especial') {
        response.status(200).send({
            mensagem: 'Você descobriu o ID especial',
            id: id
        });
    } else {
        response.status(200).send({
            mensagem: 'Você passou um ID'
        });
    }

    
});

//ALTERA UM PRODUTO
router.patch('/', (request, response, next) =>{
    response.status(201).send({
        mensagem: 'Produto Alterado'
    });
});

//EXCLUI UM PRODUTO
router.patch('/', (request, response, next) =>{
    response.status(201).send({
        mensagem: 'Produto Excluido'
    });
});


module.exports = router;