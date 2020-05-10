const express = require("express");

let app = express();

const _ = require("underscore");

let Anuncio = require("../models/anuncio");

let { verificaToken } = require("../middlewares/autenticacion");

const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APY_KEY,
    api_secret: process.env.CLOUDINARY_APY_SECRET,
});

//========================================
//           GET OBTENER ANUNCIOS
//========================================
app.get("/anuncio", (req, res) => {
    Anuncio.find({ disponible: true })
        .populate("vendedor")
        .populate("categoria")
        .exec((err, anuncios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "no pudo traer los datos",
                    },
                });
            }
            res.json({
                ok: true,
                anuncios,
            });
        });
});

//=================================================
//  GET OBTENER ANUNCIOS SEGUN TERMINO DE BUSQUEDA
//=================================================
app.get("/anuncios/:termino", (req, res) => {
    let termino = req.params.termino;
    let anunciosEncontrados = [];

    Anuncio.find({ disponible: true })
        .populate("categoria")
        .populate("vendedor")
        .exec((err, anunciosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (anunciosBD) {
                for (const prop in anunciosBD) {
                    if (
                        anunciosBD[prop].tituloAnuncio
                        .toLowerCase()
                        .indexOf(termino.toLowerCase()) >= 0
                    ) {
                        anunciosEncontrados.push(anunciosBD[prop]);
                    }
                }
            }

            res.json({
                ok: true,
                anunciosEncontrados,
            });
        });
});

//==========================================
//GET OBTENER ANUNCIOS DE UN MISMO VENDEDOR
//==========================================
app.get("/misAnuncios/:id", (req, res) => {
    let id = req.params.id;
    let misAnuncios = [];

    Anuncio.find({ disponible: true })
        .populate("categoria")
        .populate("vendedor")
        .exec((err, anunciosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (anunciosBD) {
                for (const prop in anunciosBD) {
                    if (anunciosBD[prop].vendedor._id == id) {
                        misAnuncios.push(anunciosBD[prop]);
                    }
                }
            }

            res.json({
                ok: true,
                misAnuncios,
            });
        });
});

//==========================================
//GET OBTENER ANUNCIOS DE UN MISMA CATEGORIA
//==========================================
app.get("/anunciosCategorias/:id", (req, res) => {
    let id = req.params.id;
    let misCategorias = [];

    Anuncio.find({ disponible: true })
        .populate("categoria")
        .populate("vendedor")
        .exec((err, anunciosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (anunciosBD) {
                for (const i in anunciosBD) {
                    if (anunciosBD[i].categoria._id == id) {
                        misCategorias.push(anunciosBD[i]);
                    }
                }
            }

            res.json({
                ok: true,
                misCategorias,
            });
        });
});

//========================================
//  GET POR ID -- OBTENER ANUNCIOS POR ID
//========================================
app.get("/anuncio/:id", (req, res) => {
    let id = req.params.id;

    Anuncio.findById(id)
        .populate("vendedor")
        .populate("categoria")
        .exec((err, anuncioBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!anuncioBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El id no existe",
                    },
                });
            }

            res.json({
                ok: true,
                anuncioBD,
            });
        });
});

//========================================
//           POST CREAR ANUNCIOS
//========================================
app.post("/anuncio", verificaToken, (req, res) => {
    let body = req.body;

    let anuncio = new Anuncio({
        tituloAnuncio: body.tituloAnuncio,
        precioUni: body.precioUni,
        categoria: body.categoria,
        descripcion: body.descripcion,
        ciudad: body.ciudad,
        fechaAnuncio: new Date().getTime(),
        vendedor: req.vendedor,
    });


    anuncio.save((err, anuncioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            anuncioBD,
        });
    });
});

//========================================
//           PUT ACTUALIZAR ANUNCIOS
//========================================
app.put("/anuncio/:id", (req, res) => {
    let id = req.params.id;

    Anuncio.findByIdAndUpdate(id, req.body, { new: true }, (err, anuncioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (!anuncioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Id no existe",
                },
            });
        }

        res.json({
            ok: true,
            anuncioBD,
        });
    });
});

//========================================
//           DELETE "BORRAR" ANUNCIOS
//========================================
app.delete("/anuncio/:id", (req, res) => {
    let id = req.params.id;

    Anuncio.findByIdAndUpdate(
        id, { disponible: false }, { new: true },
        async(err, anuncioBorradoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!anuncioBorradoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Id no existe",
                    },
                });
            }

            const result = await cloudinary.v2.uploader.destroy(
                anuncioBorradoBD.idImg
            );
            res.json({
                ok: true,
                anuncioBorradoBD,
            });
        }
    );
});

module.exports = app;