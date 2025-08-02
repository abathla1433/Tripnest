const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

//passport-local-mongoose plugin adds username and password fields to the schema
userSchema.plugin(passportLocalMongoose);


const User=mongoose.model("User",userSchema);

module.exports=User;