const express = require("express");
const router = express.Router();
const pool = require('../database.js'); // Asegúrate de que esta es la ruta correcta a tu archivo db

router.get("/getmargen", async (req, res) => {
    try {
        const { familia, sucursal } = req.query;
        // console.log("getmargen ", familia, "-", sucursal);

        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT margen FROM margenes WHERE familia=? AND sucursal=?', [familia, sucursal]);

        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener el margen:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.post("/insertarMargenes", async (req, res) => {
    try {
        const margenes = req.body;

        // 1. Ejecutamos TRUNCATE de manera asíncrona y esperamos a que termine
        await pool.query('TRUNCATE TABLE margenes');

        // 2. Preparamos todas las consultas de inserción en un array de promesas
        const queries = margenes.map(element => {
            const { familia, margen, sucursal } = element;
            return pool.query('INSERT INTO margenes(familia, margen, sucursal) values(?,?,?)', [familia, margen, sucursal]);
        });

        // 3. Ejecutamos todas las promesas en paralelo y esperamos a que todas terminen
        await Promise.all(queries);

        // 4. Enviamos una única respuesta de éxito después de que todas las operaciones han finalizado
        res.status(200).send("INSERTED");

    } catch (err) {
        // 5. Capturamos cualquier error que ocurra y enviamos una respuesta de error
        console.error("Error al insertar los márgenes:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/margenes", async (req, res) => {
    try {
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT * FROM margenes');

        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener los márgenes:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.put("/actualiza", async (req, res) => {
    console.log(req.body);

    const { fa, du, fr, ma, za, te, my, cambios } = req.body;
    console.log("fam ", fa, "dur ", du, "Fre ", fr, "Mzt", ma, "Zac", za, "Tecmin ", te, "May ", my, "Cambios ", cambios);
    const familias = {  //Se guardan los margenes de cada sucursal, se hayan o no modificado en el origen
        "Durango": du,
        "Fresnillo": fr,
        "Mazatlán": ma,
        "Zacatecas": za,
        "Tecmin": te,
        "Mayorista": my
    };
    const familia = fa;

    const queries = [];
    const query = 'UPDATE margenes SET margen=? WHERE sucursal=? AND familia=?';

    // Construye un array de promesas de consulta para cada sucursal que cambió
    for (const suc of cambios) {    //En cambios solo está la, o las sucursales que hayan sufrido un cambio en su margen
        if (familias[suc]) {    //accede al nuevo margen de la sucursal que aparece en cambios
            queries.push(pool.query(query, [familias[suc], suc, familia]));
        }
    }

    try {
        // Ejecuta todas las consultas en paralelo
        await Promise.all(queries);

        // Envía una respuesta de éxito una vez que todas las consultas han terminado
        res.status(200).send("UPDATED");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al actualizar la base de datos.");
    }
});

router.post("/updateMargenes", async (req, res) => {
    console.log(req.body);

    const data = req.body;
    const queries = [];

    // Crea un array de promesas de consulta para cada elemento en el cuerpo de la solicitud
    data.forEach(element => {
        const margen = element.margen;
        const familia = element.familia;
        const sucursal = element.sucursal;

        console.log(margen + "-" + familia + "-" + sucursal);
        
        queries.push(
            pool.query('UPDATE margenes SET margen=? WHERE familia=? AND sucursal=?', [margen, familia, sucursal])
        );
    });

    try {
        // Ejecuta todas las consultas en paralelo y espera a que todas terminen
        await Promise.all(queries);

        // Envía una única respuesta de éxito
        return res.status(200).send("UPDATED");

    } catch (err) {
        // Captura cualquier error que ocurra durante las consultas
        console.error("Error al actualizar márgenes:", err);
        return res.status(500).send("Error interno del servidor");
    }
});

router.post("/borrarMargenes", async (req, res) => {
    try {
        const sucursal = req.query.sucursal;

        // Ejecuta la consulta y espera a que termine
        await pool.query('DELETE FROM margenes WHERE sucursal=?', [sucursal]);

        // Envía una única respuesta de éxito después de la operación
        return res.status(200).send("BORRADA");

    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al borrar márgenes:", err);
        return res.status(500).send("Error interno del servidor");
    }
});


// Exporta el router para usarlo en index.js
module.exports = router;