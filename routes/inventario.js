const express = require("express");
const router = express.Router();
const pool = require('../database.js'); // Importa tu pool de conexiones


router.get("/getclaves", async (req, res) => {
    try {
        const rfc = req.query.rfc;
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT clave, claveprove FROM claveProveeedorView WHERE rfc=?', [rfc]);
        
        // Envía el resultado
        res.send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener claves:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getclavesnoreg", async (req, res) => {
    try {
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT clave, claveProveedor, nombre, sucursal, factura, fecha, estatus FROM clavesnoregistradasview WHERE estatus="Pendiente" ORDER BY fecha');
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener claves no registradas:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getclavesPuntuales", async (req, res) => {
    try {
        const { productos, rfc } = req.query;

        // Verifica si los datos de entrada son válidos
        if (!Array.isArray(productos) || !rfc) {
            return res.status(400).send("Datos de entrada inválidos.");
        }

        const queries = productos.map(item =>
            // Utiliza el pool de conexiones para cada consulta
            pool.query('SELECT clave FROM clavesProveeedorView WHERE claveprovedor=? AND rfc=?', [item.producto, rfc])
        );

        // Ejecuta todas las consultas en paralelo y espera a que todas terminen
        const results = await Promise.all(queries);

        // 'results' será un array de arrays, donde cada sub-array es el resultado de una consulta
        const claves = results.map(result => result[0]);

        // Envía la respuesta con todas las claves obtenidas
        res.status(200).send(claves);

    } catch (err) {
        // En caso de error, lo registramos y enviamos una respuesta de error al cliente
        console.error("Error al obtener claves puntuales:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getfamilias", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT familia FROM margenes order by familia');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error interno del servidor");
    }
})

router.get("/getSolSiembra", async (req, res) => {
    try {
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT cantidad, clave, observaciones, sucursal, fecha FROM faltantesview ORDER BY fecha');

        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener la solicitud de siembra:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.post("/insertClaveManualNoRegistrada", async (req, res) => {
    try {
        const clave = req.body.clave;
        const sucursal = req.body.sucursal;
        const rfc = req.body.proveedor;
        const factura = req.body.factura;
        const claveProveedor = req.body.claveProveedor;
        const fecha = req.body.fecha;
        //const { clave, sucursal, proveedor, factura, claveProveedor, fecha } = req.body;
        const estatus = "Pendiente";

        // Uso de await pool.query() en lugar de db.query() con callback
        const [result] = await pool.query(
            'INSERT INTO clavesnoregistradas(clave,sucursal,rfc,factura,claveProveedor,estatus,fecha) values(?,?,?,?,?,?,?)',
            [clave, sucursal, rfc, factura, claveProveedor, estatus, fecha]
        );

        // Se envía una respuesta de éxito si no hay errores
        res.status(200).send("INSERTED");

    } catch (err) {
        // Manejo de errores
        console.error("Error al insertar clave:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.post("/insertarSiembra", async (req, res) => {
    try {
        const data = req.body;
        const queries = [];

        for (const item of data) {
            queries.push(
                pool.query('INSERT INTO siembra(clave, cantidad, sucursal, proveedor) values(?,?,?,?)', [item.clave, item.cantidad, item.sucursal, item.proveedor])
            );
        }

        // Ejecuta todas las inserciones en paralelo y espera a que todas terminen
        await Promise.all(queries);

        // Envía una única respuesta de éxito después de que todas las operaciones han finalizado
        res.status(200).send("INSERTADO");

    } catch (err) {
        // Captura cualquier error que ocurra durante las consultas
        console.error("Error al insertar la siembra:", err);
        res.status(500).send("Error interno del servidor");
    }
});

module.exports = router;