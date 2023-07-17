const mongoose =require('mongoose')

const messageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    dateTime:{
        type:String
    }

},{timestamps:true})

module.exports=mongoose.model('message',messageSchema)