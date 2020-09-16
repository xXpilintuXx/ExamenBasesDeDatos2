const mysql = require('mysql');
const { database } = require('./keys');
const { promisify } = require('util');
const pool = mysql.createPool(database);



pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNTECTION_LOST') {
            console.log('conexion con base de datos cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('conexiones de base de datos excedida');
        }
        if (err.code === 'ECONNREFUSED') {
            console.log('conexion rechazada');
        }
    }
    if (connection) {
        connection.release();
        console.log('Conexion a BD establecida');
    }
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;