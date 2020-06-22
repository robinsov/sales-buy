 require('./config/config');

 //importar variables de entorno
 //require('dotenv').config({ path: 'variables.env' });

 const SocketIO = require('socket.io');

 const express = require('express');
 const mongoose = require('mongoose');

 const path = require('path');

 var cors = require('cors');

 const app = express()

 //cors
 app.use(cors());

 app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
     next();
 });

 const bodyParser = require('body-parser');

 app.use(express.static(path.join(__dirname, './bin')));

 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json())

 //confioguracion global de las rutas
 app.use(require('./routes/index'));


 app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, './bin/index.html'));
 });

 mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
     (err, resp) => {
         if (err) throw err;
         console.log('Base de datos ONLINE');
     });

 const server = app.listen(process.env.PORT, () => {
     console.log('Esta escuchando por el puerto' + process.env.PORT);
 })

 const io = SocketIO(server);

 //webSockets
 io.on('connection', (socket) => {
     //  console.log('new connection', socket.id);

     socket.on('message', (data) => {
         io.emit('message', data);

     })

     socket.on('newMessage', data => {
         socket.broadcast.emit('newMessage', data);

     })

 });