const express = require('express');
const router = express.Router();
//Importar Conexão mysql
//const mysql = require('../mysql').pool;

//Importar middleware loginAdmin
const loginAdmin = require('../middleware/loginAdmin');

//Importar middleware loginGestor
const loginGestor = require('../middleware/loginGestor');

//Importar controller fichaentrada-controller
const FichaEntradaController = require('../controllers/fichaentrada-controller');



//RETORNA TODAS AS FICHAS DE ENTRADA
router.get('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, FichaEntradaController.getTodasFichas);



//INSERE UMA FICHA DE ENTRADA
router.post('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, FichaEntradaController.postInsereFicha);



// RETORNA OS DADOS DE UMA FICHA DE ENTRADA
router.get('/:idFichaEntrada', loginAdmin.obrigatorio, loginGestor.obrigatorio, FichaEntradaController.getUmaFicha);



//ALTERA UMA FICHA DE ENTRADA
router.patch('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, FichaEntradaController.patchAlterarFicha);



//EXCLUI UMA FICHA DE ENTRADA
router.delete('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, FichaEntradaController.deleteExcluirFicha);



module.exports = router;