const express=require("express");
engine = require('ejs-mate');
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const listing = require("./models/listing");
const path=require("path");
const methodOverride = require('method-override');

app.engine('ejs', engine);
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method'));
app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

// alllisting route 
app.get("/listings",async (req,res)=>{
    let alllisting=await listing.find({});
    res.render("home.ejs",{alllisting});
});

//new route 
app.get("/listings/new", async (req,res)=> {
    res.render("new.ejs");
});

//edit form
app.get("/listings/:id/edit",async (req,res) => {
    let {id}=req.params;
    let editlisting=await listing.findById(id);
    res.render("edit.ejs",{editlisting});
});

//UPDATE
app.put("/listings/:id",async (req,res)=> {
    let {id}=req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async (req,res) => {
    let {id}=req.params;
    let deletedlist=await listing.findByIdAndDelete(id);
    res.redirect(`/listings`);
    console.log(deletedlist);
});

// new data add 
app.post("/listings",async (req,res) => {
    let newlisting=await new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});

// details route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    res.render("detail.ejs",{listings});
});

app.listen(8080,()=>{
    console.log("listening on port 8080");
});

main(console.log("DB connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}