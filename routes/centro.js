const express = require('express');
const router = express.Router();
//Importar Conexão mysql
const mysql = require('../mysql').pool;


//RETORNA TODOS OS CENTROS
router.get('/', (req, res, next) => {
    /*res.status(200).send({
        mensagem: 'Retorna todos os Centros'
    });*/

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            `SELECT     centro.idCentro,
                        centro.Nome,
                        centro.Endereco,
                        admin.idAdmin,
                        admin.Nome
            FROM        centro
            INNER JOIN  admin
                    ON  admin.idAdmin = centro.idAdmin;`,
            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                //Boas Práticas no retorno dos nossos endpoints(Documentada)
                const response = {
                    quantidade: result.length,
                    centros: result.map(centro => {
                        return {
                            idCentro: centro.idCentro,
                            Nome: centro.Nome,
                            Endereco: centro.Endereco,

                            admin: {
                                idAdmin: centro.idAdmin,
                                Nome: centro.Nome
                            },
                            
                            
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de todos os Centros',
                                url: 'http://localhost:3333/centro/' + centro.idCentro
                            }
                        }
                    })
                }
                //

                return res.status(200).send(response)
            }
        )
    })
});


//INSERE UM CENTRO
router.post('/', (req, res, next) =>{
    // Exemplo do Body-Parser ou só essa linha app.use(express.json());
    /*const Centro = {
        nome: request.body.nome,
        preco: request.body.preco
    };*/
    //

    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }

        //Analisar se tem o Admin (VALIDAÇÃO)
        conn.query(
            'SELECT * FROM admin WHERE idAdmin = ?',
            [req.body.idAdmin],
            (error, result, field) => {

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Administrador não encontrado'
                    })
                }

                //INSERIR NO BANCO DE DADO
                conn.query(
                    'INSERT INTO centro (idAdmin, Nome, Endereco) VALUES (?,?,?)',
                    [req.body.idAdmin, req.body.Nome, req.body.Endereco],
                    (error, result, field) => {
                        conn.release();
        
                        if (error) {
                            return res.status(500).send({
                                error: error
                            });
                        }
        
                        const response = {
                            mensagem: 'Centro inserido com sucesso',
                            centroCriado: {
                                idCentro: result.idCentro,
                                idAdmin: req.idAdmin,
                                Nome: req.body.Nome,
                                Endereco: req.body.Endereco,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os Centros',
                                    url: 'http://localhost:3333/centros'
                                }
                            }
                        }
        
                        return res.status(201).send(response);
                    }
                )

        })
    })
});

// RETORNA OS DADOS DE UM CENTRO
router.get('/:idCentro', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM centro WHERE idCentro = ?;',
            [req.params.idCentro],

            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Centro com este ID'
                    })
                }

                const response = {
                    centroCriado: {
                        idCentro: result[0].idCentro,
                        idAdmin: result[0].idAdmin,
                        Nome: result[0].Nome,
                        Endereco: result[0].Endereco,
                        request: {
                            tipo: 'GET ',
                            descricao: 'Retorna os detalhes de um Centro especifico',
                            url: 'http://localhost:3333/centros'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
});

//ALTERA UM CENTRO
router.patch('/', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        
        conn.query(
            `UPDATE centro
                SET Nome       = ?,
                    Endereco   = ?
                WHERE idCentro = ?`,                
            [
                req.body.Nome, 
                req.body.Endereco, 
                req.body.idCentro
            ],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem: 'Centro atualizado com sucesso',
                    centroAtualizado: {
                        idCentro: req.body.idCentro,
                        Nome: req.body.Nome,
                        Endereco: req.body.Endereco,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Retorna os detalhes de um Centro especifico',
                            url: 'http://localhost:3333/centros/' + req.body.idCentro
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    })
});

//EXCLUI UM PRODUTO
router.delete('/', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        conn.query(
            'DELETE FROM centro WHERE idCentro = ?',                
            [ req.body.idCentro],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Centro com este ID'
                    })
                }

                const response = {
                    mensagem: 'Centro removido com sucesso',
                    request: {
                        tipo: 'DELETE',
                        descricao: 'Apaga um Centro',
                        url: 'http://localhost:3333/centros',
                        body: {
                            idAdmin: 'Number',
                            Nome: 'String',
                            Endereco: 'String'
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    })
});


module.exports = router;