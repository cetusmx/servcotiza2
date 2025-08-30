const mysql = require('mysql2'); // Usa 'mysql2' para promesas

const pool = mysql.createPool({
    host: "sealmarket.mx",
    user: "sealmark_cotizauser",
    password: "Trof#4102",
    database: "sealmark_cotizador",
    waitForConnections: true,
    connectionLimit: 10, // Puedes ajustar este valor
    queueLimit: 0
}).promise();

module.exports = pool;