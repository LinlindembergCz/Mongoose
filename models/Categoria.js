const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome: { type: String},
    slug: { type: String},
    date:{ type: Date ,  default : Date.now()}
});


mongoose.model("categorias", Categoria);