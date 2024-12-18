const {proccesXML, createJSONFile} = require('../services/manejoDeDatos')
const {enviaraBD, ordenarDatos} = require('../services/manejo');


// Controlador para convertir XML a JSON
const convertXml = async (req, res) => {
    try {
        const { xml } = req.body;
        if (!xml) {
            return res.status(400).json({ success: false, message: 'XML data is required' });
        }
        const jsonData = await proccesXML(xml);
        res.status(200).json({ success: true, data: jsonData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controlador para realizar cálculos
const crearJson = (req, res) => {
    try {
        const { jsonData } = req.body;
        if (!jsonData) {
            return res.status(400).json({ success: false, message: 'JSON data is required' });
        }
        const filePath = createJSONFile(jsonData);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const ordenDeDatos = async (req, res) => {
    try {
        const { JsonFilePath } = req.body;
        if (!JsonFilePath) {
            return res.status(400).json({ success: false, message: 'La ruta del archivo es requerida' });
        }
        const datosProcesados = ordenarDatos(JsonFilePath);
        res.status(200).json({ success: true, datosProcesados });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controlador para realizar cálculos
const guardaenBD = (req, res) => {
    try {
        const { datosProcesados } = req.body;
        if (!datosProcesados) {
            return res.status(400).json({ success: false, message: 'JSON data is required' });
        }
        enviaraBD(datosProcesados);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    convertXml,
    crearJson,
    ordenDeDatos,
    guardaenBD
};
