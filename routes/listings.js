const express=require("express");
const router=express.Router();
const asyncwrap=require("../utils/Asyncwrap");
const listing = require("../models/listing");
const multer  = require('multer');
const {storage}=require("../cloudconfig");
const upload = multer({ storage });

// alllisting route 
router.get("/",asyncwrap(async (req,res)=>{
    let alllisting=await listing.find({});
    res.render("home.ejs",{alllisting});
}));

// NEW LISTING ROUTE
router.get("/new",asyncwrap( async (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.flash("error", "You must be logged in to create new listings."); 
            return res.redirect("/listings");
        }
        res.render("new.ejs");
  }));

//edit form
router.get("/:id/edit",asyncwrap (async (req,res) => {
    let {id}=req.params;
    let editlisting=await listing.findById(id);
    res.render("edit.ejs",{editlisting});
}));

//UPDATE
router.put("/:id",asyncwrap (async (req,res)=> {
    let {id}=req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash('success', 'Airbnb updated successfully');
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",asyncwrap (async (req,res) => {
    let {id}=req.params;
    let deletedlist=await listing.findByIdAndDelete(id);
    req.flash('success', 'Airbnb removed successfully');
    res.redirect(`/listings`);
    console.log(deletedlist);
}));

// new data add 
router.post("/",asyncwrap (upload.single('listing[photo]'), async (req, res, next) => {
    // let URL=req.file.path;
    let newlisting=await new listing(req.body.listing);
    newlisting.photo=URL;
    await newlisting.save();
    req.flash('success', 'Airbnb created successfully');
    res.redirect("/listings");
}));

// details route
router.get("/:id",asyncwrap (async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    res.render("detail.ejs",{listings});
}));

module.exports=router;