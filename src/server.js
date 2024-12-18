const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes');


app.use(cors(
    //{origin: 'http://192.168.88.154:8080'}
));
// Middleware para procesar JSON
app.use(bodyParser.json());
app.use(express.json());
app.use('api/data', dataRoutes);

// Configuración de la base de datos
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',       // Cambia por tu usuario
//     password: 'alejoap', // Cambia por tu contraseña
//     database: 'horarios'
// });

// // Conexión a la base de datos
// db.connect(err => {
//     if (err) {
//         console.error('Error conectando a la base de datos:', err);
//         process.exit(1);
//     }
//     console.log('Conexión a la base de datos exitosa');
// });

// Endpoint para guardar datos
app.post('/api/guardar-datos', (req, res) => {
    const datos = req.body;
    datos.forEach(dato => {
        const {ID, Name, Entrada, Salida, Fecha, Extras} = dato;
        const opentimeEntrada = new Date(dato.Entrada).toISOString().slice(0,19).replace('T',' ');
        const opentimeSalida = new Date(dato.Salida).toISOString().slice(0,19).replace('T',' ');
        const query = 'INSERT INTO procesados (ID, Name, Entrada, Salida, Fecha, Extras) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(query, [dato.ID, dato.Name, opentimeEntrada, opentimeSalida, dato.Fecha, dato.Extras], (err, result) => {
            if (err) {
                console.error('Error al insertar datos:', err);
                return res.status(500).send('Error al guardar datos');
            }
            console.log('Resultado de la insercion: ',result);
        });
    });


    res.status(200).send({message: 'Datos guardados con éxito'});
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


module.exports = app;