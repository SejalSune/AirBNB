const mongoose=require("mongoose");

const listingschema = new mongoose.Schema({
    title: String,
    photo: Array,
    description:String,
    price:Number,
    location:String,
    country:String,
});

const listing = mongoose.model('listing', listingschema);
module.exports=listing;