const express = require('express');
const router = express.Router();
const  convertXml  = require('../controllers/dataController');
const procesados = require('../controllers/dataController');

router.post('/procesar-XML', procesados.convertXml);

router.get('/traer-datos/:id', procesados.traerdatos);

router.get('/mostrar-tabla', procesados.mostrarTabla);

module.exports = router;
