const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

//CREAR SRVIDOR EXPRESS
const app = express();

//CONFIGURAR CORS
app.use(cors());

//LECTURA Y PARSEO DEL BODY
app.use( express.json() );

//DATABASE
dbConnection();

//DIRECTORIO PUBLICO
app.use(express.static('public'));

//RUTAS
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/busqueda', require('./routes/busquedas'));
app.use('/api/collection', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));


//SERVIDOR ESCUCHANDO 
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo', process.env.PORT);
});

