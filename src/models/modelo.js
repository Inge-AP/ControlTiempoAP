const db = require('../config/database');

async function getRecordById(ID) {
    console.log('ID', ID);
    const [rows] = await db.execute('SELECT * FROM procesados WHERE ID = ?', [ID]);
    console.log("leaos.",rows)
    return rows;
}

// Puedes añadir más funciones para actualizar y eliminar registros según tus necesidades

module.exports = {getRecordById };
