const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Vendedor = require('../models/vendedor');
const Anuncio = require('../models/anuncio');
const Image = require('../models/image');

const fs = require('fs');

const path = require('path');

const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_APY_KEY,
    api_secret: process.env.CLOUDINARY_APY_SECRET,
});

//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/image', async(req, res) => {
    let im = req.files.archivo;
    try {
        const result = await cloudinary.v2.uploader.upload(im.tempFilePath);

        console.log(result);
    } catch (error) {
        console.log(error);
    }


    res.json({
        im
    })
})



app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;


    //si no se ha seleccionado ningun archivo enviamos el error al vendedor
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se ha selecionado ningun archivo'
            }
        });

    }

    //validar tipo
    let tiposValidos = ['anuncios', 'vendedores'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son: ' + tiposValidos.join(', ')
            },
            ext: tipo
        });
    }

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG', 'JPG', 'GIF', 'JPEG'];

    // sino dispara el error quiere decir que si hay un archivo en tal caso 
    // lo guardamos en una variable y la tomamos de req.files.archivo
    let archivo = req.files.archivo;

    // sacamos la extension separando el nombre por puntos con la funcion split
    let nombreCortado = archivo.name.split('.');

    //guardamos la extension en una variable
    let extension = nombreCortado[nombreCortado.length - 1];

    //validamos si efectivamente el archivo tiene extension permitida
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones permitidas son ' + extensionesValidas.join(', ')
            },
            ext: extension
        });
    }

    //cambiar nombre al archivo para que sea unico y prevenir cache del navegador
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${ extension }`

    // movemos el archivo a algun lugar de la aplicacion en este caso a la carpeta 
    // uploads
    // console.log(archivo);
    // const destino = path.resolve(__dirname, `../uploads/${ tipo }/${ nombreArchivo }`)
    // archivo.mv(destino, (err) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err: {
    //                 message: 'archivo no se puede mover'
    //             }
    //         });
    //     }
    // });

    // console.log(`uploads/${ tipo }/${ nombreArchivo }`);


    //aqui ya la imagen esta cargada
    if (tipo === 'vendedores') {
        imagenVendedor(id, res, nombreArchivo, archivo);
    } else {
        imagenAnuncio(id, res, nombreArchivo);
    }


});


function imagenVendedor(id, res, nombreArchivo, archivo) {
    Vendedor.findById(id, async(err, vendedorBD) => {
        if (err) {


            return res.status(500).json({
                ok: false,
                err: {
                    message: 'anuncio no existe'
                }
            });
        }


        if (!vendedorBD) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'vendedor no existe'
                }
            });
        }

        if (vendedorBD.idImg) {
            await cloudinary.v2.uploader.destroy(vendedorBD.idImg);
        }

        console.log('nombre', nombreArchivo);
        try {
            const result = await cloudinary.v2.uploader.upload(archivo.tempFilePath);
            vendedorBD.img = result.url;
            vendedorBD.idImg = result.public_id;

        } catch (error) {
            console.log(error);
        }

        borraArchivo(nombreArchivo, 'vendedores')
        vendedorBD.save((err, vendedorGuardado) => {
            res.json({
                ok: true,
                resp: vendedorGuardado,
            })
        });

    });
}


function imagenAnuncio(id, res, nombreArchivo) {


    Anuncio.findById(id, async(err, anuncioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error en el servidor'
                }
            });
        }

        if (!anuncioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'anuncio no existe'
                }
            });
        }

        try {
            const result = await cloudinary.v2.uploader.upload(`uploads/anuncios/${ nombreArchivo }`);
            anuncioBD.img = result.url;
            anuncioBD.idImg = result.public_id;

            anuncioBD.save();

            crearImages(result, id, res)

        } catch (error) {
            console.log(error);
        }

        borraArchivo(nombreArchivo, 'anuncios')

    });
}

function crearImages(result, id, res) {

    console.log(result);
    let image = new Image({
        title: result.original_filename,
        picture: result.url,
        idImg: result.public_id,
        anuncio: id
    });

    image.save((err, imageBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'error en el servidor'
                }
            });
        }

        res.json({
            ok: true,
            imageBD
        })

    })

}


function borraArchivo(nombreImagen, tipo) {

    // como cada vendedor no puede o no debe tener mas de una imagen
    // rsolvemos haciendo uso de fs (file system) y path que permite 
    // saber si existe ya una imagen en la ruta especificada de ser asi 
    // se elimina la que ya existe y se reemplaza por la nueva
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


app.get('/image/:idAnuncio', (req, res) => {

    let anuncioId = req.params.idAnuncio;
    let imagesAnuncio = [];

    Image.find()
        .populate('anuncio')
        .exec((err, imagesBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'no pudo traer los datos'
                    }
                })
            }

            if (imagesBD) {
                for (const prop in imagesBD) {
                    if (imagesBD[prop].anuncio._id == anuncioId) {
                        console.log(imagesBD[prop].anuncio._id);
                        imagesAnuncio.push(imagesBD[prop]);
                    }
                }
            }

            res.json({
                ok: true,
                imagesAnuncio
            })
        })

})


app.delete('/image/:idImg', (req, res) => {

    let id = req.params.idImg;

    Image.findByIdAndRemove(id, async(err, imageBDBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        if (!imageBDBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Id no existe",
                },
            });
        }

        const result = await cloudinary.v2.uploader.destroy(imageBDBorrada.idImg);
        res.json({
            ok: true,
            imageBDBorrada,
        });
    });

})



module.exports = app;