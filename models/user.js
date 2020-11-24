const mongoose= require("mongoose");
const Schema= mongoose.Schema;

// EL MODELO COMO SE GUARDARA EN BASE DE DATOS
const userSchema= Schema({
    name: String,
    lastname: String,
    email:{
        type:String,
        unique:true
    },
    password: String,
    role: String,
    active:Boolean,
    avatar: String

});
module.exports= mongoose.model("User", userSchema);