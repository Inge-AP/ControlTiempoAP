const express = require('express');
const router = express.Router();
const { crearJson, convertXml, ordenDeDatos, guardaenBD } = require('../controllers/dataController');

router.post('/procesar-XML', convertXml);

router.post('/crear-json', crearJson);
// Ruta para procesar los datos del JSON
router.post('/procesar-json', ordenDeDatos);

// Ruta para guardar los datos procesados en la base de datos
router.post('/guardar-datos', guardaenBD);

module.exports = router;
