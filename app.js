var mongoose=require("mongoose");
var express=require("express");
var sanitizer=require("express-sanitizer")
var methodOverride=require("method-override");
var app=express();
var bodyParser=require("body-parser");

mongoose.connect("mongodb://localhost:27017/blog_app",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(sanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema({
    title:String,
    img:String,
    body:String,
    created:{type:Date ,default:Date.now}
});

var blog=mongoose.model("blog",blogSchema);

// blog.create({
//     title:"exam are close",
//     img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl344KXErv51NKyta7rxPBJ-g0MjqfD-798T6OJd_Nd0p2YkvNgw",
//     body:"lots of things to do with a little time in hand left .looks like i m trying to fight a shark in the middle of the ocean"
// },function(err,blogg){
//     if(err)
//     {
//         console.log(err);
//     }else{
//         console.log(blogg);
//     }
// });
app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
     blog.create(req.body.blog,function(err,newblog){
         if(err)
         {
             res.render("new");
         }
         else{
             res.redirect("/blogs");
         }
     });
});

app.get("/blogs/:id",function(req,res){
    var id=req.params.id;
    blog.findById(id,function(err,body){
        if(err)
        {
            res.redirect("/blogs");
        }else{
            res.render("show",{blog:body});
        }
    })
});

app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,body){
        if(err)
        {
            res.redirect("/blogs"+req.params.id);
        }else{
            res.render("edit",{blog:body});
        }
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
   blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
       if(err)
       {
           res.redirect("/blogs/"+req.params.id+"/edit");
       }else{
           res.redirect("/blogs/"+req.params.id);
       }
   });
});

app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.redirect("/blogs/"+req.params.id);
        }else{
            res.redirect("/blogs");
        }
    })
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server is onn !!");
})