const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let mensajeSchema = new Schema({
    mensaje: {
        type: Array
    },
    fecha: {
        type: String
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor'
    },
    anuncio: {
        type: Schema.Types.ObjectId,
        ref: 'Anuncio'
    }
});

module.exports = mongoose.model("Mensaje", mensajeSchema);