require('dotenv').config()
const multer  = require('multer');
const {storage}=require("./cloudconfig");
const upload = multer({ storage });
const express=require("express");
engine = require('ejs-mate');
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const listing = require("./models/listing");
const path=require("path");
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
// user 
const User=require("./models/user");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportlM=require('passport-local-mongoose');
app.engine('ejs', engine);
app.set('view engine', 'ejs'); 
app.use(methodOverride('_method'));
app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(flash());  // flash messages

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use((req,res,next)=>{
    res.locals.msg=req.flash("success");
    res.locals.msg=req.flash("error");
    res.locals.curruser=req.user;
    next();
});


// username and password 
app.get("/user",(req,res)=>{
    res.render("user.ejs");
});

app.get("/signup",async(req,res)=> {
    res.render("signup.ejs");
});

app.post("/signup", async (req,res)=> {
    let {username,email,password}=req.body;
    let newuser=new User({email,username});
    await User.register(newuser, password);
    console.log(newuser);
    res.redirect("/listings");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/signup' }), (req, res)=> { res.redirect("/listings") });

// alllisting route 
app.get("/listings",async (req,res)=>{
    let alllisting=await listing.find({});
    res.render("home.ejs",{alllisting});
});

//new route 
app.get("/listings/new", async (req,res)=> {
    if(req.isAuthenticated()){
        res.render("new.ejs");
    } else {
        req.flash("error","you are not loggedin");
        res.render("/listings");
    }
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
    req.flash('success', 'Airbnb updated successfully');
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async (req,res) => {
    let {id}=req.params;
    let deletedlist=await listing.findByIdAndDelete(id);
    req.flash('success', 'Airbnb removed successfully');
    res.redirect(`/listings`);
    console.log(deletedlist);
});

// new data add 
app.post("/listings",upload.single('listing[photo]'), async (req, res, next) => {
    let URL=req.file.path;
    let newlisting=await new listing(req.body.listing);
    newlisting.photo=URL;
    await newlisting.save();
    req.flash('success', 'Airbnb created successfully');
    res.redirect("/listings");
});

// details route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    res.render("detail.ejs",{listings});
});

// details route
app.use(async (req,res)=>{
    res.render("error.ejs");
});

app.listen(8080,()=>{
    console.log("listening on port 8080");
});

main(console.log("DB connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}