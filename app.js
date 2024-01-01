const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ =require("lodash");
const mongo=require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
mongo.connect("mongodb://localhost:27017/blog")

app.set('view engine', 'ejs');

const postSchema={
    title:String,
    article:String,
};

const post=mongo.model("post",postSchema)

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",async function(req,res){

  found =await post.find({},{id:1,title:1,article:1});
  // const w = await post.deleteOne({ "_id": "6592aa663a5af630f5223fcc" });
  // console.log(found)
   const value ={
      para1:homeStartingContent,
      posts:found
   }
   res.render("home",value);
})

app.get("/post/:postTitle",async function(req,res){

  const link = _.capitalize(req.params.postTitle).replace(/\s(\S)/g, function (v) { return v.toLowerCase(); })
  // console.log(link)

  found = await post.find({ "title": link }, { "title": 1, article: 1 }).collation({ locale: 'en', strength: 2 });
  // console.log(found)
  res.render("post",{element : found});
})

app.get("/about",function(req,res){
  res.render("about",{para3 : aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{para2 : contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){

  var article1=req.body.article;
  var title1=req.body.title;
  const postn=new post({
    title:title1,
    article:article1,
  })

  post.insertMany([postn]);
  res.redirect("/");
})

app.get("/edit",function(req,res){
  var article1 = req.body.article;
  var title1 = req.body.title;

})

app.post("/del",async function(req,res){
  const x=req.body.del1
  // console.log(x)
  const w = await post.deleteOne({ "_id": x }).collation({ locale: 'en', strength: 2 });
  res.redirect("/");
})

app.post("/edit1",async function(req,res){
  const x=req.body.edit2
  // console.log(x)
  const blog = await post.find({ "_id": x }, {"title": 1, "article": 1 }).collation({ locale: 'en', strength: 2 });
  // console.log(blog)
  // const article = await post.find({ "_id": x }, { "title": 0, "article": 1 }).collation({ locale: 'en', strength: 2 });
  const w = await post.deleteOne({ "_id": x }).collation({ locale: 'en', strength: 2 });
  res.render("edit",{blog:blog});
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

