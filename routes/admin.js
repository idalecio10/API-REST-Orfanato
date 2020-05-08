const express = require('express');
const router = express.Router();
//Importar Conexão mysql
const mysql = require('../mysql').pool;

//Importar Criptografia Hash(bcrypt)
const bcrypt = require('bcrypt');

//Importar JsonWebToken
const jwt = require('jsonwebtoken');



//FAZER LOGOUT (OPCIONAL ATÉ PORQUE NO CLIENT-SIDE É POSSIVEL DESTRUIR O COOKIE DE AUTENTICAÇÃO)
router.get('/logout', (req, res, next) => {
  res.status(200).send({ auth: false, token: null });
});


//FAZER O LOGIN
router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM admin WHERE Login = ?;',
            [req.body.Login],
            (error, results, fields) =>  {
                conn.release();

                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                if (results.length < 1) {
                    return res.status(401).send({
                        mensagem: 'User not Found'
                    })
                }
                //Comparar bcrypt
                bcrypt.compare(req.body.Senha, results[0].Senha, (err, result) => {
                    if (err) {
                        return res.status(401).send({
                            mensagem: 'Invalid Password'
                        })
                    }
                    if (result) {
                        //Usando JWT
                        const token = jwt.sign({
                            // PAYLOAD
                            idAdmin: results[0].idAdmin,
                            //NomeAdmin: results[0].NomeAdmin,
                            //Login: results[0].Login,
                            //Email: results[0].Email,
                            //FIM PAYLOAD
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h",
                        });
                        //
                        return res.status(200).send({
                            mensagem: 'Autenticado com sucesso',
                            NomeAdmin: results[0].NomeAdmin,
                            Login: results[0].Login,
                            Email: results[0].Email,
                            //
                            token: token
                            //
                        });
                    }

                    return res.status(401).send({
                        mensagem: 'Falha na Autenticação'
                    })
                });
            }
        );
    })
});



//RETORNA TODOS OS ADMINISTRADORES
router.get('/', (req, res, next) => {
    /*res.status(200).send({
        mensagem: 'Retorna todos os Admin'
    });
});*/

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM admin;',
            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                //Boas Práticas no retorno dos nossos endpoints(Documentada)
                const response = {
                    quantidade: result.length,
                    admins: result.map(admin => {
                        return {
                            idAdmin: admin.idAdmin,
                            Nome: admin.NomeAdmin,
                            Login: admin.Login,
                            Senha: admin.Senha,
                            Email: admin.Email,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de todos os Administradores',
                                url: 'http://localhost:3333/admin/' + admin.idAdmin
                            }
                        }
                    })
                }
                //

                return res.status(200).send({
                    response
                })
            }
        )
    })
});



//INSERE UM ADMINISTRADOR
router.post('/', (req, res, next) =>{
    // Exemplo do Body-Parser ou só essa linha app.use(express.json());
    /*const Admin = {
        nome: request.body.nome,
        login: request.body.login,
        senha: request.body.senha,
        email: request.body.email
    };*/                                                                    
    //

    //INSERIR NO BANCO DE DADOS
    mysql.getConnection((err, conn) => {
        if (err) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        
        //Ver se Já existe esse Email gravado
        conn.query(
            `SELECT * FROM admin WHERE Email = ? OR Login = ?`,
            [req.body.Email, req.body.Login],
            (error, result) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (result.length > 0) {
                    return res.status(409).send({
                        mensagem: 'Administrador já Cadastrado'
                    })
                } else {
                    bcrypt.hash(req.body.Senha, 10, (errBcrypt, hash) => {
                        if (errBcrypt) {
                            return res.status(500).send({
                                error: errBcrypt
                            })
                        }
                    
                        conn.query(
                            `INSERT INTO admin (NomeAdmin, Login, Senha, Email) VALUES (?,?,?,?)`,
                            [req.body.NomeAdmin, req.body.Login, hash, req.body.Email],
                            (error, result) => {
                                conn.release();
            
                                if (error) {
                                    return res.status(500).send({
                                        error: error
                                    })
                                }
            
                                response = {
                                    mensagem: 'Administrador inserido com sucesso',
                                    adminCriado: {
                                        idAdmin: result.idAdmin,
                                        Nome: req.body.NomeAdmin,
                                        Login: req.body.Login,
                                        Email: req.body.Email,
                                        request: {
                                            tipo: 'GET',
                                            descricao: 'Retorna todos os Administradores',
                                            url: 'http://localhost:3333/admin'
                                        }
                                    }
                                }
            
                                return res.status(201).send(response);
                            })
                    });
                }
            }
        )
    });
})




// RETORNA OS DADOS DE UM ADMINISTRADOR ESPECIFICO
router.get('/:idAdmin', (req, res, next) => {
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM admin WHERE idAdmin = ?;',
            [req.params.idAdmin],

            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Administrador com este ID'
                    })
                }

                const response = {
                    adminCriado: {
                        idAdmin: result[0].idAdmin,
                        Nome: result[0].NomeAdmin,
                        Login: result[0].Login,
                        Senha: result[0].Senha,
                        Email: result[0].Email,
                        request: {
                            tipo: 'GET ',
                            descricao: 'Retorna os detalhes de um Administrador especifico',
                            url: 'http://localhost:3333/admin'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
});

//ALTERA UM Administrador
router.patch('/', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        
        conn.query(
            `UPDATE admin
                SET NomeAdmin   = ?,
                    Login       = ?,
                    Senha       = ?,
                    Email       = ?
                WHERE idAdmin   = ?`,                
            [
                req.body.NomeAdmin, 
                req.body.Login, 
                req.body.Senha, 
                req.body.Email, 
                req.body.idAdmin
            ],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem: 'Administrador atualizado com sucesso',
                    adminAtualizado: {
                        idAdmin: req.body.idAdmin,
                        Nome: req.body.NomeAdmin,
                        Login: req.body.Login,
                        Senha: req.body.Senha,
                        Email: req.body.Email,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Retorna os detalhes de um Administrador especifico',
                            url: 'http://localhost:3333/admin/' + req.body.idAdmin
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
            `SELECT * FROM admin WHERE idAdmin = ?`,                
            [ req.body.idAdmin],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Administrador com este ID'
                    })
                }

                conn.query(
                    'DELETE FROM admin WHERE idAdmin = ?',                
                    [ req.body.idAdmin],

                    (error, result, field) => {
                        conn.release();

                        if (error) {
                            return res.status(500).send({
                                error: error
                            });
                        }

                        if (result.length == 0) {
                            return res.status(404).send({
                                mensagem: 'Não foi encontrado o Administrador com este ID'
                            })
                        }

                        const response = {
                            mensagem: 'Administrador removido com sucesso',
                            request: {
                                tipo: 'DELETE',
                                descricao: 'Apaga um Administrador',
                                url: 'http://localhost:3333/admin',
                                body: {
                                    Nome: 'String',
                                    Login: 'String',
                                    Senha: 'String',
                                    Email: 'String'
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