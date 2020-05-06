 require('./config/config');

 //importar variables de entorno
 //require('dotenv').config({ path: 'variables.env' });



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

 // parse application/x-www-form-urlencoded
 app.use(bodyParser.urlencoded({ extended: false }))
     // parse application/json
 app.use(bodyParser.json())

 //confioguracion global de las rutas
 app.use(require('./routes/index'));

 app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, './bin/index.html'));
 });

 mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true },
     (err, resp) => {
         if (err) throw err;
         console.log('Base de datos ONLINE');
     });


 app.listen(process.env.PORT, () => {
     console.log('Esta escuchando por el puerto' + process.env.PORT);
 })