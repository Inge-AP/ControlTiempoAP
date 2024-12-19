const proccesXML = require('../services/manejoDeDatos')
const procesadoService = require('../services/manejoDeDatos')
const db = require('../config/database')


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

const saveData = async (req, res) => {
    const datos = req.body;
    if (!Array.isArray(datos) || datos.length === 0){
        return res.status.send({error: 'Debe ser un array'});
    }
    try {
        const query ='INSERT INTO procesados (ID, Name, Entrada, Salida, Fecha, Extra) VALUES (?, ?, ?, ?, ?, ?)'
        datos.forEach(dato => {
            const {ID, Name, Entrada, Salida, Fecha, Extra} = dato;
            console.log("entrada",Entrada);

            // const opentimeEntrada = new Date(Entrada).toISOString().slice(0,19).repeat('T', ' ');
            // const opentimeSalida = new Date(Salida).toISOString().slice(0,19).repeat('T', ' ');
            // console.log("ews",opentimeEntrada);
           db.query(query, [ID, Name, Entrada, Salida, Fecha, Extra], (err, result) => {
                if (err){
                    console.error('Error al insertar datos', err);
                    return res.status(500).send({ error: 'Error al guardar datos'});
                }
            });
        });
        res.status(200).send({ message: 'Datos guardados con exito'});
    } catch (error) {
        
    }
    }

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

async function mostrarTabla(req, res) {
    try {
        const data = await procesadoService.getData();
        res.json(data);
    } catch (error) {
        res.status(500).json({message: 'Error al obtener los datos', error: error.message});
    }
};



module.exports = {convertXml, traerdatos, mostrarTabla, saveData};
