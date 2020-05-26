const express = require('express');

let app = express();

const bcrypt = require('bcrypt');

const _ = require('underscore');

let Vendedor = require('../models/vendedor');

const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APY_KEY,
    api_secret: process.env.CLOUDINARY_APY_SECRET,
});

//========================================
//           GET OBTENER ANUNCIOS
//========================================
app.get('/vendedor', (req, res) => {

    Vendedor.find({ estado: true })
        .exec((err, vendedores) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'no pudo traer los datos'
                    }
                })
            }
            res.json({
                ok: true,
                vendedores
            })
        })
})


//========================================
//  GET POR ID -- OBTENER ANUNCIOS POR ID
//========================================
app.get('/vendedor/:id', (req, res) => {

    let id = req.params.id;

    Vendedor.findById(id, (err, vendedorBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!vendedorBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }


        res.json({
            ok: true,
            vendedorBD
        })
    })
})


//========================================
//           POST CREAR ANUNCIOS
//========================================
app.post('/vendedor', (req, res) => {

    let body = req.body;

    let vendedor = new Vendedor({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        fechaSubs: new Date().getTime()
    })

    vendedor.save((err, vendedorBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        vendedorBD.password = ':)';

        res.json({
            ok: true,
            vendedorBD
        })
    })

})


//========================================
//           PUT ACTUALIZAR ANUNCIOS
//========================================
app.put('/vendedor/:id', (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'telefono', 'ciudad', 'fechaSubs']);

    Vendedor.findByIdAndUpdate(id, body, { new: true }, (err, vendedorBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if (!vendedorBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            })
        }

        res.json({
            ok: true,
            vendedorBD
        })
    })
})


//========================================
//           DELETE "BORRAR" ANUNCIOS
//========================================
app.delete('/vendedor/:id', (req, res) => {

    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    }

    Vendedor.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, vendedorBorradoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if (!vendedorBorradoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            })
        }

        res.json({
            ok: true,
            vendedorBorradoBD
        })

    })



})

module.exports = app;