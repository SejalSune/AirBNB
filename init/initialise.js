const mongoose=require("mongoose");
const listing = require("../models/listing");
const sampledata=require("./data");

main(console.log("DB connected")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initdata= async ()=> {
    await listing.deleteMany({});
    await listing.insertMany(sampledata.data);
    console.log("done");
}

initdata();