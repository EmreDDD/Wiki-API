//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { error } = require("console");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema={
    title:String,
    content: String
};

const Article=mongoose.model("Article",articleSchema);


////////////////////////////////////Requests Targetting all Articles////////////////////////////////////

app.route("/articles")
    .get(function(req,res){
        Article.find().then(foundArticles=>{
       res.send(foundArticles);
    })
    .catch(err=>{
       res.send(err);
    });
   })
   .post(function(req,res){

    const newArticle=new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save().then((saved)=>{
        res.send("Succesfully added a new article.");
    })
    .catch(err=>{
        res.send(err);
    });
    })
    .delete(function(req,res){
    Article.deleteMany()
    .then(deleted=>{
        res.send("Successfully deleted all articles.");
    })
    .catch(err=>{
        res.send(err);
    });
    });

////////////////////////////////////Requests Targetting A Specific Article////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    
    Article.findOne({title: req.params.articleTitle })
    .then(foundArticle => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})

.put(function(req,res){
    Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: {title: req.body.title,content:req.body.content}},
    {overwrite:true},)
    .then(saved=>{
        if(saved){
            res.send("Successfully updated article.")
        }else{
            res.send("Article not found.")
        }
    });
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle})
    .then(deleted=>{
        if(deleted){
            res.send("Successfully deleted the corresponding article.");
        }else{
            res.send("Article note found");
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});