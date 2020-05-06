var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var anuncioSchema = new Schema({
    tituloAnuncio: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio unitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        default: true
    },
    fechaAnuncio: {
        type: Date,
        required: false
    },
    ciudad: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
    idImg: {
        type: String,
        required: false
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: true
    }


});

mongoose.pluralize(null);

module.exports = mongoose.model('Anuncio', anuncioSchema);