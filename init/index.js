const initData=require("./data");
// console.log(data);
const mongoose=require('mongoose');
const Listing=require("../models/listing");

async function main(){
    await mongoose.connect('mongodb://localhost:27017/TripNest');
}
main()
 .then((res)=>{
    console.log("connection successful");
 })
 .catch((err)=>{
    console.log("connection failed");
 });

const initDb=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'6887e39daf80bbde08825cf4'}));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
}

initDb();
