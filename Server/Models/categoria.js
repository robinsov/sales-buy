const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La descripción es obligatoria"],
    },
    estado: {
        type: Boolean,
        default: true
    },
    vendedor: { type: Schema.Types.ObjectId, ref: "Vendedor" },
});

mongoose.pluralize(null);
module.exports = mongoose.model("Categoria", categoriaSchema);