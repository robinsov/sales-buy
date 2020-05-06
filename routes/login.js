const express = require('express');
//paquete para encriptar contrseñas crea encriptaciones de una sola via 
//es decir contraseñas que se encriptan y es imposible desencriptarlas
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Vendedor = require('../models/vendedor')
const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    Vendedor.findOne({ email: body.email }, (err, vendedorDB) => {

        if (err) {
            //estatus 4000 bad request o peticion mal ejecutada y el retunr para que termine la ejecucion
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!vendedorDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });
        };

        //comparamos la contraseña que puso el usuario con la contraseña que esta en el usaurio
        //que devuelve la peticion que esta en usuarioDB.password
        if (!bcrypt.compareSync(body.password, vendedorDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token = jwt.sign({
            vendedor: vendedorDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        vendedorDB.password = ':)'
        res.json({
            ok: true,
            vendedor: vendedorDB,
            token
        })
    })

})


module.exports = app;