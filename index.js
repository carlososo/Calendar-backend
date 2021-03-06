const express = require('express');
require('dotenv').config();
const {dbConnection} =require('./database/config')
const cors = require('cors');

//crear el servidor de express
const app =express();

//DataBase
dbConnection();

//CORS
app.use(cors())

//Directorio Publico
app.use( express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'))

//TODO CRUD: Eventos
app.use('/api/events', require('./routes/events'))


//escuchar peticiones

app.listen( process.env.PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
} )

