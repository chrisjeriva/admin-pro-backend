const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectionDb } = require('./database/config');

// Crear el servidor de Express
const app = express();

//configuracion de cors
app.use(cors());

// llamando la DB
connectionDb();

// Rutas
app.get('/', (req, res) => {

    res.json({
        ok: true,
        msg: 'Hola mundo'
    });

});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto '+ process.env.PORT);
});
