//Importar Conexão mysql
const mysql = require('../mysql').pool;

//Importar Criptografia Hash(bcrypt)
const bcrypt = require('bcrypt');

//Importar JsonWebToken
const jwt = require('jsonwebtoken');



//FAZER O LOGIN DO GESTOR
exports.postLoginGestor = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM gestor WHERE Login = ?;',
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
                            idGestor: results[0].idGestor,
                            NomeGestor: results[0].NomeGestor,
                            Login: results[0].Login,
                            Email: results[0].Email,
                            //FIM PAYLOAD
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h",
                        });
                        //
                        return res.status(200).send({
                            mensagem: 'Autenticado com sucesso',
                            NomeGestor: results[0].NomeGestor,
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
};



//RETORNA TODOS OS GESTORES
exports.getTodosGestores = (req, res, next) => {
    /*res.status(200).send({
        mensagem: 'Retorna todos os Gestores'
    });*/

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            `SELECT     gestor.idGestor,
                        gestor.NomeGestor,
                        gestor.Senha,
                        gestor.Login,
                        gestor.Email,
                        gestor.Celular1,
                        gestor.Celular2,
                        gestor.Celular3,
                        gestor.Endereco,
                        gestor.Sexo,
                        gestor.Foto,
                        admin.idAdmin,
                        admin.NomeAdmin,
                        centro.idCentro,
                        centro.NomeCentro
            FROM        gestor
            INNER JOIN  admin
                    ON  admin.idAdmin = gestor.idAdmin
            INNER JOIN  centro
                    ON  centro.idCentro = gestor.idCentro;`,
            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                //Boas Práticas no retorno dos nossos endpoints(Documentada)
                const response = {
                    quantidade: result.length,
                    gestores: result.map(gestor => {
                        return {
                            idGestor: gestor.idGestor,
                            Nome: gestor.NomeGestor,
                            Senha: gestor.Senha,
                            Login: gestor.Login,
                            Email: gestor.Email,
                            Celular1: gestor.Celular1,
                            Celular2: gestor.Celular2,
                            Celular3: gestor.Celular3,
                            Endereco: gestor.Endereco,
                            Sexo: gestor.Sexo,
                            Foto: gestor.Foto,

                            admin: {
                                idAdmin: gestor.idAdmin,
                                Nome: gestor.NomeAdmin
                            },
                            
                            centro: {
                                idCentro: gestor.idCentro,
                                Nome: gestor.NomeCentro
                            },
                            
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de todos os Gestores',
                                url: 'http://localhost:3333/gestor/' + gestor.idGestor
                            }
                        }
                    })
                }
                //

                return res.status(200).send(response)
            }
        )
    })
};



//INSERE UM GESTOR
exports.postInsereGestor = (req, res, next) =>{
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

                //Analisar se tem o Centro (VALIDAÇÃO)
                conn.query(
                    'SELECT * FROM centro WHERE idCentro = ?',
                    [req.body.idCentro],
                    (error, result, field) => {
        
                        if (error) {
                            return res.status(500).send({
                                error: error
                            });
                        }
        
                        if (result.length == 0) {
                            return res.status(404).send({
                                mensagem: 'Centro não encontrado'
                            })
                        }

                        //Ver se Já existe esse Email gravado
                        conn.query(
                            `SELECT * FROM gestor WHERE Email = ? OR Login = ?`,
                            [req.body.Email, req.body.Login],
                            (error, result) => {
                                if (error) {
                                    return res.status(500).send({
                                        error: error
                                    })
                                }
                
                                if (result.length > 0) {
                                    return res.status(409).send({
                                        mensagem: 'Gestor já Cadastrado'
                                    })
                                } else {
                                    bcrypt.hash(req.body.Senha, 10, (errBcrypt, hash) => {
                                        if (errBcrypt) {
                                            return res.status(500).send({
                                                error: errBcrypt
                                            })
                                        }

                                        //INSERIR NO BANCO DE DADO
                                        conn.query(
                                            `INSERT INTO gestor (idAdmin, idCentro, NomeGestor, Senha, Login, Email, Celular1, Celular2, Celular3, Endereco,
                                                Sexo, Foto) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                                            [req.body.idAdmin, req.body.idCentro, req.body.NomeGestor, hash, req.body.Login, req.body.Email, req.body.Celular1, 
                                                req.body.Celular2, req.body.Celular3, req.body.Endereco, req.body.Sexo, req.body.Foto],
                                            (error, result, field) => {
                                                conn.release();
                                
                                                if (error) {
                                                    return res.status(500).send({
                                                        error: error
                                                    });
                                                }
                                
                                                const response = {
                                                    mensagem: 'Gestor inserido com sucesso',
                                                    gestorCriado: {
                                                        idGestor: result.idGestor,
                                                        idAdmin: req.idAdmin,
                                                        idCentro: req.idCentro,
                                                        Nome: req.body.NomeGestor,
                                                        Login: req.body.Login,
                                                        Email: req.body.Email,
                                                        Celular1: req.body.Celular1,
                                                        Celular2: req.body.Celular2,
                                                        Celular3: req.body.Celular3,
                                                        Endereco: req.body.Endereco,
                                                        Sexo: req.body.Sexo,
                                                        Foto: req.body.Foto,
                                                        request: {
                                                            tipo: 'GET',
                                                            descricao: 'Retorna todos os Gestores',
                                                            url: 'http://localhost:3333/gestor'
                                                        }
                                                    }
                                                }
                                
                                                return res.status(201).send(response);
                                            }
                                        )
                                    }
                                )}
                            }
                        )
                    }
                )
            }
        )
    });
};



// RETORNA OS DADOS DE UM GESTOR
exports.getUmGestor = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM gestor WHERE idGestor = ?;',
            [req.params.idGestor],

            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Gestor com este ID'
                    })
                }

                const response = {
                    centroCriado: {
                        idGestor: result[0].idGestor,
                        idAdmin: result[0].idAdmin,
                        idCentro: result[0].idCentro,
                        Nome: result[0].NomeGestor,
                        Senha: result[0].Senha,
                        Login: result[0].Login,
                        Email: result[0].Email,
                        Celular1: result[0].Celular1,
                        Celular2: result[0].Celular2,
                        Celular3: result[0].Celular3,
                        Endereco: result[0].Endereco,
                        Sexo: result[0].Sexo,
                        Foto: result[0].Foto,
                        request: {
                            tipo: 'GET ',
                            descricao: 'Retorna os detalhes de um Gestor especifico',
                            url: 'http://localhost:3333/gestor'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
};



//ALTERA UM GESTOR
exports.patchAlterarGestor = (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        
        conn.query(
            `UPDATE gestor
                SET idCentro   = ?,
                    NomeGestor = ?,
                    Senha      = ?,
                    Login      = ?,
                    Email      = ?,
                    Celular1   = ?,
                    Celular2   = ?,
                    Celular3   = ?,
                    Endereco   = ?,
                    Sexo       = ?,
                    Foto       = ?
                WHERE idGestor = ?`,                
            [
                req.body.idCentro,
                req.body.NomeGestor, 
                req.body.Senha,
                req.body.Login,
                req.body.Email,
                req.body.Celular1,
                req.body.Celular2,
                req.body.Celular3,
                req.body.Endereco,
                req.body.Sexo,
                req.body.Foto, 
                req.body.idGestor
            ],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem: 'Gestor atualizado com sucesso',
                    centroAtualizado: {
                        idGestor: req.body.idGestor,
                        idAdmin: req.body.idAdmin,
                        idCentro: req.body.idCentro,
                        Nome: req.body.NomeGestor,
                        Senha: req.body.Senha,
                        Login: req.body.Login,
                        Email: req.body.Email,
                        Celular1: req.body.Celular1,
                        Celular2: req.body.Celular2,
                        Celular3: req.body.Celular3,
                        Endereco: req.body.Endereco,
                        Sexo: req.body.Sexo,
                        Foto: req.body.Foto,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Retorna os detalhes de um Gestor especifico',
                            url: 'http://localhost:3333/gestor/' + req.body.idGestor
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    })
};



//EXCLUI UM GESTOR
exports.deleteExcluirGestor = (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        conn.query(
            `SELECT * FROM gestor WHERE idGestor = ?`,                
            [ req.body.idGestor],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado o Gestor com este ID'
                    })
                }
        
                conn.query(
                    'DELETE FROM gestor WHERE idGestor = ?',                
                    [ req.body.idGestor],

                    (error, result, field) => {
                        conn.release();

                        if (error) {
                            return res.status(500).send({
                                error: error
                            });
                        }

                        if (result.length == 0) {
                            return res.status(404).send({
                                mensagem: 'Não foi encontrado o Gestor com este ID'
                            })
                        }

                        const response = {
                            mensagem: 'Gestor removido com sucesso',
                            request: {
                                tipo: 'DELETE',
                                descricao: 'Apaga um Gestor',
                                url: 'http://localhost:3333/Gestor',
                                body: {
                                    idAdmin: 'Number',
                                    idCentro: 'Number',
                                    Nome: 'String',
                                    Senha: 'String',
                                    Login: 'String',
                                    Email: 'String',
                                    Celular1: 'Number',
                                    Celular2: 'Number',
                                    Celular3: 'Number',
                                    Endereco: 'String',
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
};