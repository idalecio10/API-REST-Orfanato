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

//Importar middleware loginGestor
const loginGestor = require('../middleware/loginGestor');

//Importar controller menino-controller
const MeninoController = require('../controllers/menino-controller');



//RETORNA TODOS OS MENINOS
router.get('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, MeninoController.getTodosMeninos);



//INSERE UM MENINO
router.post('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, multer(multerConfig).single("Foto"), MeninoController.postInsereMenino);



// RETORNA OS DADOS DE UM MENINO
router.get('/:idMenino', loginAdmin.obrigatorio, loginGestor.obrigatorio, MeninoController.getUmMenino);



//ALTERA UM MENINO
router.patch('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, MeninoController.patchAlterarMenino);



//EXCLUI UM MENINO
router.delete('/', loginAdmin.obrigatorio, loginGestor.obrigatorio, MeninoController.deleteExcluirMenino);



module.exports = router;