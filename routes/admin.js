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

//Importar controller admin-controller
const AdminController = require('../controllers/admin-controller');



//FAZER LOGOUT (OPCIONAL ATÉ PORQUE NO CLIENT-SIDE É POSSIVEL DESTRUIR O COOKIE DE AUTENTICAÇÃO)
router.get('/logout', (req, res, next) => {
  res.status(200).send({ auth: false, token: null });
});



//FAZER O LOGIN DO ADMIN
router.post('/login', AdminController.postLoginAdmin);



//RETORNA TODOS OS ADMINISTRADORES
router.get('/', loginAdmin.obrigatorio, AdminController.getTodosAdmin);



//INSERE UM ADMINISTRADOR
router.post('/', loginAdmin.obrigatorio, AdminController.postInsereAdmin);



// RETORNA OS DADOS DE UM ADMINISTRADOR ESPECIFICO
router.get('/:idAdmin', loginAdmin.obrigatorio, AdminController.getUmAdmin);



//ALTERA UM ADMINISTRADOR
router.patch('/', loginAdmin.obrigatorio, AdminController.patchAlterarAdmin);



//EXCLUI UM ADMINISTRADOR
router.delete('/', loginAdmin.obrigatorio, AdminController.deleteExcluirAdmin);



module.exports = router;