require('dotenv').config()
const express=require("express");
engine = require('ejs-mate');
const app=express();
const mongoose=require("mongoose");
const ejs=require("ejs");
const path=require("path");
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError=require("./utils/ExpressError");
const listingroutes=require("./routes/listings");
const userroutes=require("./routes/user");
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.set('view engine', 'ejs'); 

app.use(express.static('views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(flash());

app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
}));

app.use((req,res,next)=>{
    res.locals.Successmsg=req.flash("success");
    res.locals.Errormsg=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

app.use("/listings", listingroutes);
app.use("/", userroutes);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("listening on port 8080");
});

main(console.log("DB connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}