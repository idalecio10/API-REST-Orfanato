const express = require('express');
const router = express.Router();
//Importar Conexão mysql
const mysql = require('../mysql').pool;

//Importar Multer para Upload de Imagem
const multer = require('multer');
//Importar configurações do Multer
const multerConfig = require('../src/config/multer');

//Importar middleware loginAdmin
const loginAdmin = require('../middleware/loginAdmin');


//RETORNA TODOS OS CENTROS
router.get('/', loginAdmin.obrigatorio, (req, res, next) => {
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
                        centro.NomeCentro,
                        centro.Endereco,
                        centro.Foto,
                        admin.idAdmin,
                        admin.NomeAdmin
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
                            Nome: centro.NomeCentro,
                            Endereco: centro.Endereco,
                            Foto: centro.Foto,

                            admin: {
                                idAdmin: centro.idAdmin,
                                Nome: centro.NomeAdmin
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
router.post('/', loginAdmin.obrigatorio, multer(multerConfig).single("Foto"), (req, res, next) =>{
    //Mostrar dados da Foto
    console.log(req.file); 

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
                    'INSERT INTO centro (idAdmin, NomeCentro, Endereco, Foto) VALUES (?,?,?,?)',
                    [req.body.idAdmin, req.body.NomeCentro, req.body.Endereco, req.file.path],
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
                                Nome: req.body.NomeCentro,
                                Endereco: req.body.Endereco,
                                Foto: req.file.path,
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
router.get('/:idCentro', loginAdmin.obrigatorio, (req, res, next) => {

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
                        Nome: result[0].NomeCentro,
                        Endereco: result[0].Endereco,
                        Foto: result[0].Foto,
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
router.patch('/', loginAdmin.obrigatorio, (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        
        conn.query(
            `UPDATE centro
                SET NomeCentro = ?,
                    Endereco   = ?
                    Foto       = ?
                WHERE idCentro = ?`,                
            [
                req.body.NomeCentro, 
                req.body.Endereco, 
                req.body.Foto, 
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
                        Nome: req.body.NomeCentro,
                        Endereco: req.body.Endereco,
                        Foto: req.body.Foto,
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
router.delete('/', loginAdmin.obrigatorio, (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        conn.query(
            `SELECT * FROM centro WHERE idCentro = ?`,                
            [ req.body.idCentro],

            (error, result, field) => {
                conn.release();

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

                        const response = {
                            mensagem: 'Centro removido com sucesso',
                            request: {
                                tipo: 'DELETE',
                                descricao: 'Apaga um Centro',
                                url: 'http://localhost:3333/centros',
                                body: {
                                    idAdmin: 'Number',
                                    Nome: 'String',
                                    Endereco: 'String',
                                    Foto: 'String',
                                }
                            }
                        }
                        return res.status(202).send(response);
                    }
                )
            }
        )
    })
});


module.exports = router;