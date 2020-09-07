const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connectionDb } = require('./database/config');

// Crear el servidor de Express
const app = express();

//configuracion de cors
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// llamando la DB
connectionDb();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/all', require('./routes/busquedas'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto '+ process.env.PORT);
});
