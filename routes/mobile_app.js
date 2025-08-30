const express = require("express");
const router = express.Router();
const pool = require('../database.js'); // Asegúrate de que esta es la ruta correcta a tu archivo db

// Endpoint para obtener un resumen de inventarios
router.get("/getresumeninventarios", async (req, res) => {
    try {
        const auditor = req.query.auditor;
        console.log(auditor);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, qtyProductos, Ciudad, Almacen, Fecha, qtyLineas, ProgressPorcentage FROM inv_resumen_inventarios_app_view WHERE Auditor=?', [auditor]);
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener resumen de inventarios:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getauditores", async (req, res) => {
    try {
        // Utilizamos el pool de conexiones para ejecutar la consulta de manera asíncrona
        const [rows] = await pool.query('SELECT id, Nombre FROM Auditores ORDER BY Nombre');
        
        // Enviamos la respuesta con los datos obtenidos
        res.status(200).send(rows);
    } catch (err) {
        // En caso de error, lo registramos y enviamos una respuesta de error al cliente
        console.error("Error al obtener auditores:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getlineas", async (req, res) => {
    try {
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query("SELECT DISTINCT linea FROM Productos WHERE linea<>''");
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener líneas:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getnombresinv", async (req, res) => {
    try {
        const rfc = req.query.rfc; // La variable rfc no se utiliza, puedes eliminarla si quieres
        console.log(rfc);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query("SELECT DISTINCT InventarioID FROM Inventarios");
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener nombres de inventario:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getresumeninventariosweb", async (req, res) => {
    try {
        const auditor = req.query.auditor; // Esta variable no se utiliza en la consulta, puedes eliminarla
        console.log(auditor);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, qtyProductos, Ciudad, Almacen, Fecha, qtyLineas, ProgressPorcentage, Auditor FROM inv_resumen_inventarios_app_view');
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener resumen de inventarios web:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getresumeninventariosgenerales", async (req, res) => {
    try {
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, Ciudad, Almacen, Ubicacion, Lineas, Auditor, Fecha FROM InventarioGenerals');
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener resumen de inventarios generales:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getresumeninventariosgeneralesaudit", async (req, res) => {
    try {
        const auditor = req.query.auditor;
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, Ciudad, Almacen, Ubicacion, Lineas, Auditor, Fecha FROM InventarioGenerals WHERE Auditor=?', [auditor]);
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener resumen de inventarios generales para auditor:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getresumentarjetasini", async (req, res) => {
    try {
        const auditor = req.query.auditor; // Esta variable no se utiliza en la consulta, puedes eliminarla
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT Asignados, Completos, Incompletos, Percentage FROM inv_resumen_tarjetas_inv_app_view');
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener resumen de tarjetas:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getresumeninventario", async (req, res) => {
    try {
        const { InventarioID, auditor } = req.query;
        // console.log("getResumenInv ", InventarioID, "-", auditor);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, qtyProductos, Ciudad, Almacen, Fecha, qtyLineas, ProgressPorcentage FROM inv_resumen_inventarios_app_view WHERE InventarioID=? AND Auditor=?', [InventarioID, auditor]);
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener el resumen de inventario:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getlineasinvresumen", async (req, res) => {
    try {
        const { InventarioID, auditor } = req.query;
        // console.log("getLineas ", InventarioID, "-", auditor);

        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, Linea, qtyProductosLinea, NombreLinea, isCounted, isAdjusted FROM inv_lineas_app_view WHERE InventarioID=? AND Auditor=?', [InventarioID, auditor]);

        // Envía el resultado
        res.status(200).send(rows);

    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener líneas de inventario:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getproductosporlineaeinv", async (req, res) => {
    try {
        const { InventarioID, Linea, auditor } = req.query;

        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, Linea, Clave, Descripcion, Unidad FROM Inventarios WHERE InventarioID=? and Linea=? and Auditor=?', [InventarioID, Linea, auditor]);

        // Envía el resultado
        res.status(200).send(rows);

    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener productos por línea e inventario:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getproductoscontadosporauditoreinv", async (req, res) => {
    try {
        const { InventarioID, auditor } = req.query;
        // console.log("Dentro getproductoscontadosporauditoreinv ", InventarioID, "-", auditor);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT Clave, Descripcion, Unidad, Existencia, Observaciones FROM ProductoContados WHERE InventarioID=? and Auditor=?', [InventarioID, auditor]);
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener productos contados por auditor e inventario:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getproductoscontadosporauditorporlineaeinv", async (req, res) => {
    try {
        const { InventarioID, Linea, auditor } = req.query;
        // console.log("Dentro getproductoscontadosporauditorporlineaeinv ", InventarioID, "-", Linea, "-", auditor);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT Clave, Descripcion, Unidad, Existencia, Observaciones FROM ProductoContados WHERE InventarioID=? and Auditor=? and Linea=?', [InventarioID, auditor, Linea]);
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener productos contados por auditor, inventario y línea:", err);
        res.status(500).send("Error interno del servidor");
    }
});

router.get("/getdetallelinea", async (req, res) => {
    try {
        const { InventarioID, Linea, auditor } = req.query;
        // console.log("Endpoint getdetallelinea", InventarioID, "-", Linea, "--", auditor);
        
        // Ejecuta la consulta y espera a que termine
        const [rows] = await pool.query('SELECT InventarioID, Ciudad, Almacen, Linea, NombreLinea FROM inv_lineas_app_view WHERE InventarioID=? and Linea=? and Auditor=?', [InventarioID, Linea, auditor]);
        
        // Envía el resultado
        res.status(200).send(rows);
        
    } catch (err) {
        // Captura y maneja cualquier error
        console.error("Error al obtener detalle de línea:", err);
        res.status(500).send("Error interno del servidor");
    }
});

// Exporta el router para usarlo en index.js
module.exports = router;