const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let likeSchema = new Schema({
    anuncio: {
        type: Schema.Types.ObjectId,
        ref: 'Anuncio',
        required: false
    },
    vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'Vendedor',
        required: false
    }
});




module.exports = mongoose.model("Like", likeSchema);