const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let imageSchema = new Schema({
    title: {
        type: String
    },
    picture: {
        type: String
    },
    idImg: {
        type: String
    },
    anuncio: {
        type: Schema.Types.ObjectId,
        ref: 'Anuncio'
    }
});

module.exports = mongoose.model("Image", imageSchema);