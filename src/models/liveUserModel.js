const mongoose =require('mongoose')

const liveUserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },


},{timestamps:true})

module.exports=mongoose.model('liveUser',liveUserSchema)