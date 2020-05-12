const express = require('express');
const router = express.Router();
//Importar Conexão mysql
//const mysql = require('../mysql').pool;

//Importar Criptografia Hash(bcrypt)
//const bcrypt = require('bcrypt');

//Importar JsonWebToken
//const jwt = require('jsonwebtoken');

//Importar middleware loginAdmin
const loginAdmin = require('../middleware/loginAdmin');

//Importar controller gestor-controller
const GestorController = require('../controllers/gestor-controller');



//FAZER LOGOUT (OPCIONAL ATÉ PORQUE NO CLIENT-SIDE É POSSIVEL DESTRUIR O COOKIE DE AUTENTICAÇÃO)
router.get('/logout', (req, res, next) => {
    res.status(200).send({ auth: false, token: null });
});
  
  

//FAZER O LOGIN
router.post('/login', GestorController.postLoginGestor);



//RETORNA TODOS OS GESTORES
router.get('/', loginAdmin.obrigatorio, GestorController.getTodosGestores);



//INSERE UM GESTOR
router.post('/', loginAdmin.obrigatorio, GestorController.postInsereGestor);



// RETORNA OS DADOS DE UM GESTOR
router.get('/:idGestor', loginAdmin.obrigatorio, GestorController.getUmGestor);



//ALTERA UM GESTOR
router.patch('/', loginAdmin.obrigatorio, GestorController.patchAlterarGestor);



//EXCLUI UM GESTOR
router.delete('/', loginAdmin.obrigatorio, GestorController.deleteExcluirGestor);



module.exports = router;