const express = require('express');
let app = express();

let Mensajes = require('../models/mensajes');


app.get('/mensaje', (req, res) => {
    Mensajes.find()
        .populate('vendedor')
        .populate('anuncio')
        .exec((err, mensajesBD) => {
            if (err) {
                res.status('500').json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                mensajesBD
            })
        })
})



app.get('/mensaje/:idVendedor', (req, res) => {
    let id = req.params.idVendedor;
    let mensajes = [];
    Mensajes.find()
        .populate('vendedor')
        .populate('anuncio')
        .exec((err, mensajesBD) => {
            if (err) {
                res.status('500').json({
                    ok: false,
                    err
                })
            }

            if (mensajesBD) {
                for (const prop in mensajesBD) {
                    // console.log(mensajesBD[prop].anuncio, String(id));
                    if (String(mensajesBD[prop].vendedor._id === String(id))) {
                        mensajes.push(mensajesBD[prop]);
                    }
                }
            }

            // console.log(mensajes);

            res.json({
                ok: true,
                mensajes
            })
        })
})


app.get('/mensajeGuardado/:idMensaje', (req, res) => {
    let id = req.params.idMensaje;
    Mensajes.findById(id)
        .populate('vendedor')
        .populate('anuncio')
        .exec((err, mensajeBD) => {
            if (err) {
                res.status('500').json({
                    ok: false,
                    err
                })
            }

            if (!mensajeBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Id no existe",
                    },
                });
            }

            res.json({
                ok: true,
                mensajeBD
            })
        })
})




app.get('/mensajeAnuncio/:idAnuncio', (req, res) => {
    let id = req.params.idAnuncio;
    let mensajesAnuncio = [];
    Mensajes.find()
        .populate('vendedor')
        .populate('anuncio')
        .exec((err, mensajesBD) => {
            if (err) {
                res.status('500').json({
                    ok: false,
                    err
                })
            }

            if (mensajesBD) {
                for (const prop in mensajesBD) {
                    // console.log(mensajesBD[prop]);
                    if (mensajesBD[prop].anuncio._id == id) {
                        mensajesAnuncio.push(mensajesBD[prop]);
                    }
                }
            }

            // console.log(like);

            res.json({
                ok: true,
                mensajes: mensajesAnuncio
            })
        })
})

app.post("/mensajeUpdate/:idMensaje", (req, res) => {
    let id = req.params.idMensaje;
    let mensaje = req.body.mensaje;

    Mensajes.findById(id, (err, mensajesBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (!mensajesBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Id no existe",
                },
            });
        }
        // console.log(mensaje);
        // console.log(mensajesBD);

        if (mensajesBD) {
            mensajesBD.mensaje.push(req.body);
        }
        mensajesBD.save();

        res.json({
            ok: true,
            mensajesBD,
        });
    });
});


app.post("/mensaje", (req, res) => {
    let body = req.body;
    let horaExacta = new Date();
    horaExacta = `${horaExacta.getHours()}:${horaExacta.getMinutes()}`;
    // console.log(horaExacta);

    let mensajes = new Mensajes({
        mensaje: body.mensaje,
        anuncio: body.anuncio,
        fecha: horaExacta,
        vendedor: body.vendedor,
    });


    mensajes.save((err, mensajesBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            mensajesBD,
        });
    });
});

module.exports = app;