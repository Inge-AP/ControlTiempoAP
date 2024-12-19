const express = require('express');
const router = express.Router();
const procesados = require('../controllers/dataController');

router.post('/guardar-datos', procesados.saveData);

router.get('/traer-datos/:id', procesados.traerdatos);

router.get('/mostrar-tabla', procesados.mostrarTabla);

module.exports = router;
