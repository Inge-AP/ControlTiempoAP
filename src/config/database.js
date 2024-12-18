const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       
    password: 'alejoap', 
    database: 'horarios'
})

const insert = async (tabla, datos) => {
    const keys = Object.keys(datos).join(',');
    const values = Object.values(datos).map(() => '?').join(',');
    const query = `INSERT INTO ${tabla} (${keys}) VALUES (${values})`;

    const [result] = await pool.query(query, Object.values(datos));
    return result;
}

module. exports = {pool, insert};