const express = require('express');
const router = express.Router();
const  convertXml  = require('../controllers/dataController');
const procesados = require('../controllers/dataController');

router.post('/procesar-XML', convertXml.convertXml);

router.get('/traer-datos/:id', procesados.traerdatos);

module.exports = router;
