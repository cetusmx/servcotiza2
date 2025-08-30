const express = require("express");
const app = express();
const pool = require('./database.js');

const preciosRoutes = require('./routes/precios.js');
const mobileappRoutes = require('./routes/mobile_app.js');
const margenesRoutes = require('./routes/margenes.js');
const inventarioRoutes = require('./routes/inventario.js');

var bodyParser = require('body-parser');

app.use(express.json({
    type: ['application/json', 'text/plain'],
    limit: '50mb',
    extended: true
}))

// Asigna las rutas a sus respectivos prefijos
app.use('/precios', preciosRoutes);
app.use('/mobileapp', mobileappRoutes);
app.use('/margenes', margenesRoutes);
app.use('/inventario', inventarioRoutes);

app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001")
})