const express = require('express');
const router = express.Router();
//Importar Conexão mysql
//const mysql = require('../mysql').pool;

//Importar Multer para Upload de Imagem
const multer = require('multer');
//Importar configurações do Multer
const multerConfig = require('../src/config/multer');

//Importar middleware loginAdmin
const loginAdmin = require('../middleware/loginAdmin');

//Importar controller gestor-controller
const CentroController = require('../controllers/centro-controller');



//RETORNA TODOS OS CENTROS
router.get('/', CentroController.getTodosCentros);



//INSERE UM CENTRO
router.post('/', loginAdmin.obrigatorio, multer(multerConfig).single("Foto"), CentroController.postInsereCentro);



// RETORNA OS DADOS DE UM CENTRO
router.get('/:idCentro', CentroController.getUmCentro);



//ALTERA UM CENTRO
router.patch('/', loginAdmin.obrigatorio, CentroController.patchAlterarCentro);



//EXCLUI UM CENTRO
router.delete('/', loginAdmin.obrigatorio, CentroController.deleteExcluirCentro);



module.exports = router;