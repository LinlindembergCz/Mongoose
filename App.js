/*
npm install nodemon -g
npm install --save sequelize
npm install sequelize postgres
npm install express
npm install --save express-handlebars
npm install --save body-parser
npm install --save mongoose
npm install --save express-session
npm install --save connect-flash
npm install ejs --save 

*/


const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

//session

app.use(session( 
{
secret: "nodejs",    
resave: true,
saveUninitialized: true
}));

app.use(flash());

//Middlware
app.use( ( req, res, next) => {    
 res.locals.success_msg= req.flash("success_msg");
 res.locals.error_msg= req.flash("error_msg");
 next();
})



//configuracoes
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());   
app.engine('handlebars', handlebars({defaultlayout:'main'})); 

app.set('view engine','handlebars');

//rotas
app.use('/admin', admin);

//public (arquivos staticos)    

app.use( express.static(path.join(__dirname,'/public')));
app.use( ( req, res, next) => 
        {   
            console.log('Middleware vrificando requisicao');
            next();
        } );    

//mongoose

mongoose.connect("mongodb://localhost:27017/blogapp", 
{
    autoIndex: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).
then( () =>{console.log("conectado")},
      err => {console.log("REIOUSSE"+Err)} );

//outras

const PORT = 8081;
app.listen( PORT, () =>{console.log ('servidor rodando');} )

