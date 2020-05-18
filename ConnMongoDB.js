const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/local',
{
    useNewUrlParser:true,
    useUnifiedTopology: true
}).
then(function () {console.log('conectado com sucesso')}).
catch(function () {console.log('Falhou')});

const Schema = mongoose.Schema;

const usuarioSchema = new Schema(
    { 
        nome : {type: String},
        sobrenome :{type: String},
        email: {type: String},
        idade: {type: Number},
        pais: {type: String}
    }    
);

mongoose.model('usuarios', usuarioSchema);

const Pessoa = mongoose.model('usuarios');

new Pessoa(
{
    nome: "lindemberg",
    sobrenome: "cortez",
    email: "lindemberg@gmail.com",
    idade:44,
    pais: "Brasil"
}).
 save().
 then( () => {console.log("salvo com sucesso")}).
 catch( (err) => { console.log("falha"+err)});