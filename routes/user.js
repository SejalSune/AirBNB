const express=require("express");
const router=express.Router();
const asyncwrap=require("../utils/Asyncwrap");
const User=require("../models/user");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportlM=require('passport-local-mongoose');

router.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// username and password 
router.get("/user",(req,res)=>{
    res.render("user.ejs");
});

router.get("/signup",(req,res)=> {
    res.render("signup.ejs");
});

router.post("/signup",asyncwrap (async (req,res,next)=> {
        let {username,email,password}=req.body;
        let newuser=new User({email,username});
        await User.register(newuser, password);
        console.log(newuser);
        res.redirect("/listings");
}));

router.get("/login",(req,res)=>{
    res.render("login.ejs");
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/signup' }), (req, res)=> { res.redirect("/listings") });

module.exports=router;