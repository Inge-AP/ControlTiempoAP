const proccesXML = require('../services/manejoDeDatos')
const procesadoService = require('../services/manejoDeDatos')


// Controlador para convertir XML a JSON
const convertXml = async (req, res) => {
    try {
        const { xml } = req.body.xml;
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
async function traerdatos(req, res) {
    try {
        const id = req.params.id;
        const data = await procesadoService.getDataById(id);
        if (!data) {
            return res.status(404).json({ message: 'Registro no encontrado', data: data });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los datos', error: error.message});
    }
};



module.exports = {convertXml, traerdatos};
