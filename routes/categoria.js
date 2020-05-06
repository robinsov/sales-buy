const express = require('express');

let app = express();

const _ = require('underscore');

let Categoria = require('../models/categoria');

let { verificaToken } = require('../middlewares/autenticacion');

//========================================
//           GET OBTENER ANUNCIOS
//========================================
app.get('/categoria', (req, res) => {

    Categoria.find({ estado: true })
        .populate('vendedor')
        .exec((err, categorias) => {
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
                categorias
            })
        })
})


//========================================
//  GET POR ID -- OBTENER ANUNCIOS POR ID
//========================================
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }


        res.json({
            ok: true,
            categoriaBD
        })
    })
})


//========================================
//           POST CREAR ANUNCIOS
//========================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        vendedor: req.vendedor
    })

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        console.log('guardo');

        res.json({
            ok: true,
            categoriaBD
        })
    })

})


//========================================
//           PUT ACTUALIZAR ANUNCIOS
//========================================
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;


    Categoria.findByIdAndUpdate(id, req.body, { new: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoriaBD
        })
    })
})


//========================================
//           DELETE "BORRAR" ANUNCIOS
//========================================
app.delete('/categoria/:id', (req, res) => {

    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    }

    Categoria.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, categoriaBorradoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        if (!categoriaBorradoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe'
                }
            })
        }

        res.json({
            ok: true,
            categoriaBorradoBD
        })

    })

})

module.exports = app;