const mongoose =require('mongoose')

const messageSchema = new mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    message:{
        type:String,
        required:true
    },
    dateTime:{
        type:String
    }

},{timestamps:true})

module.exports=mongoose.model('message',messageSchema)