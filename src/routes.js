const express = require('express');

const routes = express.Router();

const rotaAdmin = require('../routes/admin');
const rotaCentros = require('../routes/centro');
const rotaGestores = require('../routes/gestor');
const rotaMeninos = require('../routes/menino');
const rotaFichaEntrada = require('../routes/fichaentrada');

//Rotas
routes.use('/admin', rotaAdmin);
routes.use('/centros', rotaCentros);
routes.use('/gestor', rotaGestores);
routes.use('/menino', rotaMeninos);
routes.use('/fichaentrada', rotaFichaEntrada);
//

module.exports = routes;