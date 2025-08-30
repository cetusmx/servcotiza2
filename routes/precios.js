const express = require("express");
const router = express.Router();
const pool = require('../database.js'); // Importa tu pool de conexiones

// Endpoint para obtener precios por sucursal
router.get("/getprecios", async (req, res) => {
    try {
        const { sucursal } = req.query;

        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT clave, precio, precioIVA FROM preciosView WHERE sucursal=? ORDER BY clave', [sucursal]);

        // Envía el resultado
        res.status(200).send(rows);

    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener los precios por sucursal:", err);
        res.status(500).send("Error interno del servidor");
    }
});

app.get("/getpreciosall", async (req, res) => {
    try {
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT clave, precio, precioIVA, sucursal FROM preciosView ORDER BY clave');

        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener todos los precios:", err);
        res.status(500).send("Error interno del servidor");
    }
});

app.post("/updateListaPrecios", async (req, res) => {
    console.log(req.body);

    const data = req.body;
    const queries = [];

    // Crea un array de promesas de consulta para cada elemento en el cuerpo de la solicitud
    data.forEach(element => {
        const clave = element.Clave;
        const precio = element.Precio;
        const sucursal = element.Sucursal;

        console.log(clave + "-" + precio + "-" + sucursal);
        
        queries.push(
            pool.query('UPDATE precios SET precio=? WHERE clave=? AND sucursal=?', [precio, clave, sucursal])
        );
    });

    try {
        // Ejecuta todas las consultas en paralelo y espera a que todas terminen
        await Promise.all(queries);

        // Envía una única respuesta de éxito
        return res.status(200).send("UPDATED");

    } catch (err) {
        // Captura cualquier error que ocurra durante las consultas
        console.error("Error al actualizar la lista de precios:", err);
        return res.status(500).send("Error interno del servidor");
    }
});

app.post("/insertarLista", async (req, res) => {
    try {
        const data = req.body;
        const queries = [];

        for (const item of data) {
            queries.push(
                pool.query('INSERT INTO precios(clave, precio, sucursal) values(?,?,?)', [item.clave, item.precio, item.sucursal])
            );
        }

        // Ejecuta todas las inserciones en paralelo y espera a que todas terminen
        await Promise.all(queries);

        // Envía una única respuesta de éxito después de que todas las operaciones han finalizado
        res.status(200).send("INSERTADO");

    } catch (err) {
        // Captura cualquier error que ocurra durante las consultas
        console.error("Error al insertar la lista:", err);
        res.status(500).send("Error interno del servidor");
    }
});

app.post("/borrarLista", async (req, res) => {
    try {
        const sucursal = req.query.sucursal;
        
        // Ejecuta la consulta y espera a que termine
        await pool.query('DELETE FROM precios WHERE sucursal=?', [sucursal]);
        
        // Envía una única respuesta de éxito después de la operación
        return res.status(200).send("BORRADA");
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al borrar lista:", err);
        return res.status(500).send("Error interno del servidor");
    }
});

// Exporta el router para usarlo en index.js
module.exports = router;