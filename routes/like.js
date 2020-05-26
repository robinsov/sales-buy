const express = require('express');
let app = express();

const Like = require('../models/like');


app.get('/like', (req, res) => {
    Like.find()
        .populate('vendedor')
        .populate('anuncio')
        .exec((err, likeBD) => {
            if (err) {
                res.status('500').json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                likeBD
            })
        })
})

// app.get('/like/:idVendedor', (req, res) => {
//     let id = req.params.idVendedor;
//     console.log(id);
//     let like = [];
//     Like.find()
//         .populate('vendedor')
//         .populate('anuncio')
//         .exec((err, likeBD) => {
//             if (err) {
//                 res.status('500').json({
//                     ok: false,
//                     err
//                 })
//             }



//             if (likeBD) {
//                 for (const prop in likeBD) {
//                     if (likeBD[prop].vendedor._id == id) {
//                         like.push(likeBD[prop]);
//                     }
//                 }
//             }



//             res.json({
//                 ok: true,
//                 like
//             })
//         })
// })

app.get('/like/:idAnuncio', (req, res) => {
    let id = req.params.idAnuncio;
    console.log(id);
    let likesAnuncios = [];
    Like.find()
        .populate('vendedor')
        .populate('anuncio')
        .exec((err, likeBD) => {
            if (err) {
                res.status('500').json({
                    ok: false,
                    err
                })
            }

            console.log(likeBD);


            if (likeBD) {
                for (const prop in likeBD) {
                    console.log(likeBD[prop]);
                    if (likeBD[prop].anuncio._id == id) {
                        likesAnuncios.push(likeBD[prop]);
                    }
                }
            }


            console.log(likesAnuncios);

            res.json({
                ok: true,
                likesAnuncios
            })
        })
})



app.post("/like", (req, res) => {
    let body = req.body;

    let like = new Like({
        anuncio: body.anuncio,
        vendedor: body.vendedor,
    });


    like.save((err, likeBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            likeBD,
        });
    });
});

app.delete("/like/:id", (req, res) => {
    let id = req.params.id;

    Like.findByIdAndDelete(
        id,
        async(err, likeBorradoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!likeBorradoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Id no existe",
                    },
                });
            }

            res.json({
                ok: true,
                likeBorradoBD,
            });
        }
    );
});



module.exports = app;