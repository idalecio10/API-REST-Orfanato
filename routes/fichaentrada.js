const express = require('express');
const router = express.Router();
//Importar Conexão mysql
const mysql = require('../mysql').pool;


//RETORNA TODAS AS FICHAS DE ENTRADA
router.get('/', (req, res, next) => {
    /*res.status(200).send({
        mensagem: 'Retorna todos as Fichas de Entrada'
    });*/

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM fichaentrada;',
            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                //Boas Práticas no retorno dos nossos endpoints(Documentada)
                const response = {
                    quantidade: result.length,
                    fichaentradas: result.map(fichaentrada => {
                        return {
                            idFichaEntrada: fichaentrada.idFichaEntrada,
                            idMenino: fichaentrada.idMenino,
                            idGestor: fichaentrada.idGestor,
                            idCentro: fichaentrada.idCentro,
                            NomeFamiliares: fichaentrada.NomeFamiliares,
                            DataFicha: fichaentrada.DataFicha,
                            Celular1: fichaentrada.Celular1,
                            Celular2: fichaentrada.Celular2,
                            Celular3: fichaentrada.Celular3,
                            PessoasLocalizacao: fichaentrada.PessoasLocalizacao,
                            NumeroEncontros: fichaentrada.NumeroEncontros,
                            MotivoSaidaMenino: fichaentrada.MotivoSaidaMenino,
                            SituacaoSocialFamilia: fichaentrada.SituacaoSocialFamilia,
                            SituacaoEconomicaFamilia: fichaentrada.SituacaoEconomicaFamilia,
                            ReacaoMeninoFamiliaEncontro: fichaentrada.ReacaoMeninoFamiliaEncontro,
                            FamiliaFrequentaIgreja: fichaentrada.FamiliaFrequentaIgreja,
                            RelacaoMeninoFamilia: fichaentrada.RelacaoMeninoFamilia,
                            Obs: fichaentrada.Obs,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de todas as Fichas de Entrada',
                                url: 'http://localhost:3333/fichaentrada/' + fichaentrada.idFichaEntrada
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


//INSERE UMA FICHA DE ENTRADA
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

        //Analisar se tem o Menino (VALIDAÇÃO)
        conn.query(
            'SELECT * FROM menino WHERE idMenino = ?',
            [req.body.idMenino],
            (error, result, field) => {

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Menino não encontrado'
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

                                //INSERIR NO BANCO DE DADO
                                conn.query(
                                    `INSERT INTO fichaentrada (idMenino, idGestor, idCentro, NomeFamiliares, DataFicha, Celular1, Celular2, Celular3, PessoasLocalizacao,
                                        NumeroEncontros, MotivoSaidaMenino, SituacaoSocialFamilia, SituacaoEconomicaFamilia, ReacaoMeninoFamiliaEncontro,
                                        FamiliaFrequentaIgreja, RelacaoMeninoFamilia, Obs) VALUES (?,?,?,?,now(),?,?,?,?,?,?,?,?,?,?,?,?)`,
                                    [req.body.idMenino, req.body.idGestor, req.body.idCentro, req.body.NomeFamiliares, req.body.Celular1, 
                                        req.body.Celular2, req.body.Celular3, req.body.PessoasLocalizacao, req.body.NumeroEncontros, req.body.MotivoSaidaMenino,
                                            req.body.SituacaoSocialFamilia, req.body.SituacaoEconomicaFamilia, req.body.ReacaoMeninoFamiliaEncontro, 
                                                req.body.FamiliaFrequentaIgreja, req.body.RelacaoMeninoFamilia, req.body.Obs],
                                    (error, result, field) => {
                                        conn.release();
                        
                                        if (error) {
                                            return res.status(500).send({
                                                error: error
                                            });
                                        }
                        
                                        const response = {
                                            mensagem: 'Ficha de Entrada inserido com sucesso',
                                            fichaEntradaCriada: {
                                                idFichaEntrada: result.idFichaEntrada,
                                                idMenino: req.idMenino,
                                                idGestor: req.idGestor,
                                                idCentro: req.idCentro,
                                                NomeFamiliares: req.body.NomeFamiliares,
                                                DataFicha: req.body.DataFicha,
                                                Celular1: req.body.Celular1,
                                                Celular2: req.body.Celular2,
                                                Celular3: req.body.Celular3,
                                                PessoasLocalizacao: req.body.PessoasLocalizacao,
                                                NumeroEncontros: req.body.NumeroEncontros,
                                                MotivoSaidaMenino: req.body.MotivoSaidaMenino,
                                                SituacaoSocialFamilia: req.body.SituacaoSocialFamilia,
                                                SituacaoEconomicaFamilia: req.body.SituacaoEconomicaFamilia,
                                                ReacaoMeninoFamiliaEncontro: req.body.ReacaoMeninoFamiliaEncontro,
                                                FamiliaFrequentaIgreja: req.body.FamiliaFrequentaIgreja,
                                                RelacaoMeninoFamilia: req.body.RelacaoMeninoFamilia,
                                                Obs: req.body.Obs,
                                                request: {
                                                    tipo: 'GET',
                                                    descricao: 'Retorna todas as Fichas de Entrada',
                                                    url: 'http://localhost:3333/fichaentrada'
                                                }
                                            }
                                        }
                        
                                        return res.status(201).send(response);
                                    }
                                )
                        })
                })
        })
    })
});

// RETORNA OS DADOS DE UMA FICHA DE ENTRADA
router.get('/:idFichaEntrada', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error 
            }) 
        }
        conn.query(
            'SELECT * FROM fichaentrada WHERE idFichaEntrada = ?;',
            [req.params.idFichaEntrada],

            (error, result, fields) =>  {
                if (error) { 
                    return res.status(500).send({ 
                        error: error 
                    }) 
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado a Ficha de Entrada com este ID'
                    })
                }

                const response = {
                    fichaEntradaCriado: {
                        idFichaEntrada: result[0].idFichaEntrada,
                        idMenino: result[0].idMenino,
                        idGestor: result[0].idGestor,
                        idCentro: result[0].idCentro,
                        NomeFamiliares: result[0].NomeFamiliares,
                        DataFicha: result[0].DataFicha,
                        Celular1: result[0].Celular1,
                        Celular2: result[0].Celular2,
                        Celular3: result[0].Celular3,
                        PessoasLocalizacao: result[0].PessoasLocalizacao,
                        NumeroEncontros: result[0].NumeroEncontros,
                        MotivoSaidaMenino: result[0].MotivoSaidaMenino,
                        SituacaoSocialFamilia: result[0].SituacaoSocialFamilia,
                        SituacaoEconomicaFamilia: result[0].SituacaoEconomicaFamilia,
                        ReacaoMeninoFamiliaEncontro: result[0].ReacaoMeninoFamiliaEncontro,
                        FamiliaFrequentaIgreja: result[0].FamiliaFrequentaIgreja,
                        RelacaoMeninoFamilia: result[0].RelacaoMeninoFamilia,
                        Obs: result[0].Obs,
                        request: {
                            tipo: 'GET ',
                            descricao: 'Retorna os detalhes de uma Ficha de Entrada especifica',
                            url: 'http://localhost:3333/fichaentrada'
                        }
                    }
                }

                return res.status(200).send(response);
            }
        )
    })
});

//ALTERA UMA FICHA DE ENTRADA
router.patch('/', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        
        conn.query(
            `UPDATE fichaentrada
                SET idCentro                     = ?,
                    NomeFamiliares               = ?,
                    DataFicha                    = ?,
                    Celular1                     = ?,
                    Celular2                     = ?,
                    Celular3                     = ?,
                    PessoasLocalizacao           = ?,
                    NumeroEncontros               = ?,
                    MotivoSaidaMenino            = ?,
                    SituacaoSocialFamilia        = ?,
                    SituacaoEconomicaFamilia     = ?,
                    ReacaoMeninoFamiliaEncontro  = ?,
                    FamiliaFrequentaIgreja       = ?,
                    RelacaoMeninoFamilia         = ?,
                    Obs                          = ?
                WHERE idFichaEntrada             = ?`,                
            [
                req.body.idCentro,
                req.body.NomeFamiliares, 
                req.body.DataFicha,
                req.body.Celular1,
                req.body.Celular2,
                req.body.Celular3,
                req.body.PessoasLocalizacao,
                req.body.NumeroEncontros,
                req.body.MotivoSaidaMenino,
                req.body.SituacaoSocialFamilia,
                req.body.SituacaoEconomicaFamilia, 
                req.body.ReacaoMeninoFamiliaEncontro, 
                req.body.FamiliaFrequentaIgreja, 
                req.body.RelacaoMeninoFamilia, 
                req.body.Obs,
                req.body.idFichaEntrada
            ],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    });
                }

                const response = {
                    mensagem: 'Ficha de Entrada atualizada com sucesso',
                    fichaEntradaAtualizada: {
                        idFichaEntrada: req.body.idFichaEntrada,
                        idMenino: req.body.idMenino,
                        idGestor: req.body.idGestor,
                        idCentro: req.body.idCentro,
                        NomeFamiliares: req.body.NomeFamiliares,
                        DataFicha: req.body.DataFicha,
                        Celular1: req.body.Celular1,
                        Celular2: req.body.Celular2,
                        Celular3: req.body.Celular3,
                        PessoasLocalizacao: req.body.PessoasLocalizacao,
                        NumeroEncontros: req.body.NumeroEncontros,
                        MotivoSaidaMenino: req.body.MotivoSaidaMenino,
                        SituacaoSocialFamilia: req.body.SituacaoSocialFamilia,
                        SituacaoEconomicaFamilia: req.body.SituacaoEconomicaFamilia,
                        ReacaoMeninoFamiliaEncontro: req.body.ReacaoMeninoFamiliaEncontro,
                        FamiliaFrequentaIgreja: req.body.FamiliaFrequentaIgreja,
                        RelacaoMeninoFamilia: req.body.RelacaoMeninoFamilia,
                        Obs: req.body.Obs,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Retorna os detalhes de uma Ficha de Entrada especifica',
                            url: 'http://localhost:3333/fichaentrada/' + req.body.idFichaEntrada
                        }
                    }
                }

                return res.status(202).send(response);
            }
        )
    })
});

//EXCLUI UMA FICHA DE ENTRADA
router.delete('/', (req, res, next) =>{
    
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ 
                error: error
            }) 
        }
        conn.query(
            `SELECT * FROM fichaentrada WHERE idFichaEntrada = ?`,                
            [ req.body.idFichaEntrada],

            (error, result, field) => {
                conn.release();

                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado a Ficha de Entrada com este ID'
                    })
                }

                conn.query(
                    'DELETE FROM fichaentrada WHERE idFichaEntrada = ?',                
                    [ req.body.idFichaEntrada],

                    (error, result, field) => {
                        conn.release();

                        if (error) {
                            return res.status(500).send({
                                error: error
                            });
                        }

                        if (result.length == 0) {
                            return res.status(404).send({
                                mensagem: 'Não foi encontrado a Ficha de Entrada com este ID'
                            })
                        }

                        const response = {
                            mensagem: 'Ficha de Entrada removido com sucesso',
                            request: {
                                tipo: 'DELETE',
                                descricao: 'Apaga uma Ficha de Entrada',
                                url: 'http://localhost:3333/fichaentrada',
                                body: {
                                    idMenino: 'Number',
                                    idGestor: 'Number',
                                    idCentro: 'Number',
                                    NomeFamiliares: 'String',
                                    DataFicha: 'String',
                                    Celular1: 'Number',
                                    Celular2: 'Number',
                                    Celular3: 'Number',
                                    PessoasLocalizacao: 'String',
                                    NumeroEncontros: 'String',
                                    MotivoSaidaMenino: 'String',
                                    SituacaoSocialFamilia: 'String',Login: 'String',
                                    SituacaoEconomicaFamilia: 'String',
                                    ReacaoMeninoFamiliaEncontro: 'String',
                                    FamiliaFrequentaIgreja: 'String',
                                    RelacaoMeninoFamilia: 'String',
                                    Obs: 'String',
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