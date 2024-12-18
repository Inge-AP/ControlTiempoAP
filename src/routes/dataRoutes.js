const express = require('express');
const router = express.Router();
const { crearJson, convertXml, ordenDeDatos, guardaenBD } = require('../controllers/dataController');

router.post('api/data/procesar-XML', convertXml);

router.post('api/data/crear-json', crearJson);
// Ruta para procesar los datos del JSON
router.post('api/data/procesar-json', ordenDeDatos);

// Ruta para guardar los datos procesados en la base de datos
router.post('api/data/guardar-datos', guardaenBD);

module.exports = router;
