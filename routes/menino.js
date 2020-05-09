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

//Importar middleware loginGestor
const loginGestor = require('../middleware/loginGestor');


//RETORNA TODOS OS MENINOS
router.get('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, (req, res, next) => {
    /*res.status(200).send({
        mensagem: 'Retorna todos os Meninos'
    });*/

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            `SELECT     menino.idMenino,
                        menino.NomeMenino,
                        menino.Apelidos,
                        menino.DataNascimento,
                        menino.DataCadastro,
                        menino.Sexo,
                        menino.Foto,
                        gestor.idGestor,
                        gestor.NomeGestor 
            FROM        menino
            INNER JOIN  gestor
                    ON  gestor.idGestor = menino.idGestor;`,
            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                //Boas Práticas no retorno dos nossos endpoints(Documentada)
                const response = {
                    quantidade: result.length,
                    meninos: result.map(menino => {
                        return {
                            idMenino: menino.idMenino,
                            idGestor: menino.idGestor,
                            Nome: menino.NomeMenino,
                            Apelidos: menino.Apelidos,
                            DataNascimento: menino.DataNascimento,
                            DataCadastro: menino.DataCadastro,
                            Sexo: menino.Sexo,
                            Foto: menino.Foto,

                            gestor: {
                                idGestor: menino.idAdmin,
                                Nome: menino.NomeGestor
                            },

                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de todos os Meninos',
                                url: 'http://localhost:3333/menino/' + menino.idMenino
                            }
                        }
                    })
                }
                //

                return res.status(200).send(response);
            }
        )
    })
});


//INSERE UM MENINO
router.post('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, multer(multerConfig).single("Foto"), (req, res, next) =>{
    //Mostrar dados da Foto
    console.log(req.file); 

    //Os dados de quem acessou
    //console.log(req.usuario); 

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

            //Analisar se tem o Gestor (VALIDAÇÃO)
            conn.query(
                'SELECT * FROM gestor WHERE idGestor = ?',
                [req.body.idGestor],
                (error, result, field) => {
        
                    if (error) {
                        return res.status(500).send({
                            error: error
                        });
                    }
        
                    if (result.length == 0) {
                        return res.status(404).send({
                            mensagem: 'Gestor não encontrado'
                        })
                    }

                //INSERIR NO BANCO DE DADO
                conn.query(
                    `INSERT INTO menino (idGestor, NomeMenino, Apelidos, DataNascimento, DataCadastro, Sexo, Foto) VALUES (?,?,?,?,now(),?,?)`,
                    [req.body.idGestor, req.body.NomeMenino, req.body.Apelidos, req.body.DataNascimento,
                        req.body.Sexo, req.file.path],
                    (error, result, field) => {
                        conn.release();
            
                        if (error) {
                            return res.status(500).send({
                                error: error
                            });
                        }
            
                        const response = {
                            mensagem: 'Menino inserido com sucesso',
                            meninoCriado: {
                                idMenino: req.idMenino,
                                idGestor: result.idGestor,
                                Nome: req.body.NomeMenino,
                                Apelidos: req.body.Apelidos,
                                DataNascimento: req.body.DataNascimento,
                                DataCadastro: req.body.DataCadastro,
                                Sexo: req.body.Sexo,
                                Foto: req.file.path,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos os MENINOS',
                                    url: 'http://localhost:3333/menino'
                                }
                            }
                        }
            
                        return res.status(201).send(response);
                    }
                )
            })
    })
});

// RETORNA OS DADOS DE UM MENINO
router.get('/:idMenino', loginAdmin.obrigatorio, loginGestor.obrigatorio, (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM menino WHERE idMenino = ?;',
            [req.params.idMenino],

            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Menino com este ID'
                    })
                }

                const response = {
                    meninoCriado: {
                        idMenino: result[0].idMenino,
                        idGestor: result[0].idGestor,
                        Nome: result[0].NomeMenino,
                        Apelidos: result[0].Apelidos,
                        DataNascimento: result[0].DataNascimento,
                        DataCadastro: result[0].DataCadastro,
                        Sexo: result[0].Sexo,
                        Foto: result[0].Foto,
                        request: {
                            tipo: 'GET ',
                            descricao: 'Retorna os detalhes de um Menino especifico',
                            url: 'http://localhost:3333/menino'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
});

//ALTERA UM MENINO
router.patch('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        conn.query(
            `UPDATE menino
                SET NomeMenino      = ?,
                    Apelidos        = ?,
                    DataNascimento  = ?,
                    Sexo            = ?,
                    Foto            = ?
                WHERE idMenino      = ?`,                
            [
                req.body.NomeMenino, 
                req.body.Apelidos,
                req.body.DataNascimento,
                req.body.Sexo,
                req.body.Foto, 
                req.body.idMenino
            ],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem: 'Menino atualizado com sucesso',
                    meninoAtualizado: {
                        idMenino: req.body.idMenino,
                        idGestor: req.body.idGestor,
                        Nome: req.body.NomeMenino,
                        Apelidos: req.body.Apelidos,
                        DataNascimento: req.body.DataNascimento,
                        Sexo: req.body.Sexo,
                        Foto: req.body.Foto,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Retorna os detalhes de um Menino especifico',
                            url: 'http://localhost:3333/menino/' + req.body.idMenino
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    })
});

//EXCLUI UM MENINO
router.delete('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        conn.query(
            `SELECT * FROM menino WHERE idMenino = ?`,                
            [ req.body.idMenino],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Menino com este ID'
                    })
                }

                conn.query(
                    `DELETE FROM menino WHERE idMenino = ?`,                
                    [ req.body.idMenino],

                    (error, result, field) => {
                        conn.release();

                        if (error) {
                            return res.status(500).send({
                                error: error
                            })
                        }

                        const response = {
                            mensagem: 'Menino removido com sucesso',
                            request: {
                                tipo: 'DELETE',
                                descricao: 'Apaga um Menino',
                                url: 'http://localhost:3333/menino',
                                body: {
                                    idGestor: 'Number',
                                    Nome: 'String',
                                    Apelidos: 'String',
                                    DataNascimento: 'String',
                                    DataCadastro: 'String',
                                    Sexo: 'String',
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