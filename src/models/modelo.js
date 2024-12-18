const db = require('../config/database');

async function getRecordById(ID) {
    console.log('ID', ID);
    const [rows] = await db.execute('SELECT * FROM procesados WHERE ID = ?', [ID]);
    console.log("leaos.",rows)
    return rows;
}

async function getRecord() {
    const [rows] = await db.execute('SELECT * FROM procesados');
    return rows;
}

module.exports = {getRecordById, getRecord};
