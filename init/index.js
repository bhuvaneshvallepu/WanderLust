const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB= async()=>{
    await Listing.deleteMany({}); 
    initData.data= initData.data.map((obj)=>({...obj,owner:"67164a1c12f174427f5399be"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB().catch(err => console.error("Error initializing data:", err));