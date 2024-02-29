const mongoose=require('mongoose');
const adminSchema=new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
});

const adminModal=mongoose.model("admin",adminSchema);
module.exports=adminModal;