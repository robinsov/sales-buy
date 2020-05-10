const express = require("express");
//paquete para encriptar contrseñas crea encriptaciones de una sola via
//es decir contraseñas que se encriptan y es imposible desencriptarlas
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Vendedor = require("../models/vendedor");
const app = express();

var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(CLIENT_ID);

app.post("/login", (req, res) => {
    let body = req.body;

    Vendedor.findOne({ email: body.email }, (err, vendedorDB) => {
        if (err) {
            //estatus 4000 bad request o peticion mal ejecutada y el retunr para que termine la ejecucion
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!vendedorDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrecto",
                },
            });
        }

        //comparamos la contraseña que puso el usuario con la contraseña que esta en el usaurio
        //que devuelve la peticion que esta en usuarioDB.password
        if (!bcrypt.compareSync(body.password, vendedorDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrecto",
                },
            });
        }

        let token = jwt.sign({
                vendedor: vendedorDB,
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );

        vendedorDB.password = ":)";
        res.json({
            ok: true,
            vendedor: vendedorDB,
            token,
        });
    });
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };
}

//=======================================
// LOGIN DE GOOGLE
//==============================
app.post("/login/google", async(req, res) => {
    let token = req.body.token;

    let googleUser = await verify(token).catch((e) => {
        return res.status(403).json({
            ok: false,
            mensaje: "token no valido",
        });
    });

    console.log(googleUser);

    Vendedor.findOne({ email: googleUser.email }, (err, vendedorDB) => {
        if (err) {
            //estatus 4000 bad request o peticion mal ejecutada y el retunr para que termine la ejecucion
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar elñ usuario',
                errros: err
            });
        }
        console.log('encontrado', vendedorDB);

        if (vendedorDB) {
            if (vendedorDB.google === false) {
                return res.json({
                    ok: false,
                    mensaje: "Debe utilizar la atutenticacion normal",
                });
            } else {
                let token = jwt.sign({
                        vendedor: vendedorDB,
                    },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
                );

                res.json({
                    ok: true,
                    vendedorDB,
                    token,
                });
            }

        } else {
            //el usuario no existe debemos crearlo
            let vendedor = new Vendedor();

            vendedor.nombre = googleUser.nombre;
            vendedor.email = googleUser.email;
            vendedor.img = googleUser.img;
            vendedor.google = true;
            vendedor.password = ':)'

            console.log('vendedor a guardar', vendedor);

            vendedor.save((err, vendedorDB) => {

                let token = jwt.sign({
                        vendedor: vendedorDB,
                    },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }
                );

                console.log(vendedorDB);

                // vendedorDB.password = ":)";
                res.json({
                    ok: true,
                    vendedorDB,
                    token,
                });
            });
        }
    });
});

module.exports = app;