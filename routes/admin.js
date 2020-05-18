const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


require('../models/Categoria');
require('../models/Postagem');

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");

router.get('/', (req, res) => { res.render('admin/index') });

router.get('/categorias', (req, res) => { 
                                         Categoria.find().then( (categorias) => {
                                         // res.render('admin/categorias', {categorias: categorias} ) 
                                          res.render("admin/categorias",
                                           {categorias: categorias.map(categorias => categorias.toJSON())})
                                                                                }
                                                              );
                                        }
           );


router.get('/categorias/add', (req, res) => { res.render("admin/addcategorias") });

router.get('/categorias/edit/:id', (req, res) => { 
    Categoria.findOne({_id: req.params.id}).lean().then(  (categoria) =>
    {
     res.render("admin/editcategorias", 
     {id: categoria._id, 
      nome: categoria.nome , 
     lug: categoria.slug});
    })
});

router.post('/categorias/edit', (req, res) => {
    Categoria.findOne({_id: req.body.id }).then( (categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug                
        categoria.save().
        then( ()=> {
            req.flash("success_msg","CATEGORIA SALVA COM SUCESSO!");
            res.redirect('/admin/categorias');}).
        catch( (err) => {
            req.flash("error_msg","houve um erro ao SALVAR a categoria!");
            res.redirect('/admin/categorias');
        });         
    });      
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.remove({_id: req.body.id}).
        then( ()=> {
            req.flash("success_msg","CATEGORIA DELETADA COM SUCESSO!");
            res.redirect('/admin/categorias');}).
        catch( (err) => {
            req.flash("error_msg","houve um erro ao DELETAR a categoria!");
            res.redirect('/admin/categorias');});         
});      


router.post('/categorias/nova', (req, res) => {

var erros = [];

   if (!req.body.nome ||  typeof req.body.nome ==undefined ||  req.body.nome ==null)
    {
        erros.push({texto:"nome invalido"});
    }

    if (req.body.nome.length  < 2 )
    {
        erros.push({texto:"nome muito pequeno"});
    }

    if (!req.body.slug ||  typeof req.body.slug ==undefined ||  req.body.slug ==null)
    {
        erros.push({texto:"slug invalido"});
    }

    if (erros.length > 0 ) 
    {
        res.render('admin/addcategorias',{erros: erros })
    }
    else
    {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        
        new Categoria(novaCategoria).save().
        then( ()=> {
            req.flash("success_msg","CATEGORIA CRIADA COM SUCESSO!");
            res.redirect('/admin/categorias');}).
        catch( (err) => {
            req.flash("error_msg","houve um erro ao cadastrar a categoria!");
            res.redirect('/admin/categorias/add');
        });   
    
    }   
 });

router.get('/postagens', (req, res) => { 

    Postagem.find().lean().populate('categoria').then( (postagens) => {
        res.render("admin/postagens", 
        {postagens: postagens} 
        ) });
   }
);


router.get('/postagens/add',(rea, res)=> {
    Categoria.find().lean().then( (categorias)=>{ 
        res.render("admin/addpostagens", 
        {categorias:categorias})
    })   
})



router.get('/postagens/edit/:id', (req, res) => { 
    Postagem.findById(req.params.id).lean().populate('categoria').then( (postagens) =>
    {
        Categoria.find().lean().then( (categorias) => { 
            res.render("admin/editpostagens", { 
                postagens: postagens, categorias: categorias})})
    })
});

router.post('/postagens/nova', (req, res) => {    
  
    const novaPostagem = {
       slug: req.body.slug,
       titulo: req.body.titulo , 
       descricao: req.body.descricao,  
       conteudo: req.body.conteudo,
       categoria : req.body.categoria
    }
    
    new Postagem(novaPostagem).save().
    then( ()=> {
        req.flash("success_msg","Postagem CRIADA COM SUCESSO!");
        res.redirect('/admin/postagens');}).
    catch( (err) => {
        req.flash("error_msg","houve um erro ao cadastrar a Postagem!");
        res.redirect('/admin/postagens/add');
    }); 

})

router.post('/postagens/edit', (req, res) => {
 
    Postagem.findOne({_id: req.body.id }).then( (postagem) => {
        postagem.slug      = req.body.slug     
        postagem.titulo    = req.body.titulo
        postagem.descricao = req.body.descricao
        postagem.conteudo  = req.body.conteudo
        postagem.categoria = req.body.categoria 
        postagem.save().
        then( ()=> {
            req.flash("success_msg","POSTAGEM SALVA COM SUCESSO!");
            res.redirect('/admin/postagens');}).
        catch( (err) => {
            req.flash("error_msg","houve um erro ao SALVAR a POSTAGEM!");
            res.redirect('/admin/postagens');
        });         
    });    
});


router.post('/postagens/deletar', (req, res) => {
    Postagem.remove({_id: req.body.id}).
        then( ()=> {
            req.flash("success_msg","POSTAGEM DELETADA COM SUCESSO!");
            res.redirect('/admin/postagens');}).
        catch( (err) => {
            req.flash("error_msg","houve um erro ao DELETAR a POSTAGEM!");
            res.redirect('/admin/postagens');});         
});  


module.exports = router;
