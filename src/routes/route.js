
const express =require('express')
const router= express.Router()
const validator = require('validator')
const jwt =require('jsonwebtoken')


const messageModel= require('../models/messageModel')
const userModel=require('../models/userModel')


const midd=require('../middlewares/authenticationMiddleware')




const {io} =require("socket.io-client")
var socket



// this is user registertion api
router.post('/registeration',async function(req,res){
    try{
        const data =req.body
        const createData={}
        // validations
        
        if(data.userName.length<4 || !data.userName) return res.json({ message: "user name lenght shoud be greater than 4 or required" })
        if (!(data.userName).match(/^[a-zA-Z0-9_]+$/)) return res.json({ message: "give valid user name" })    


        if(!data.email) return res.json({message:"email is required"})
        if (!validator.isEmail(data.email)) {
            return res.json({  message: "please enter valid email address!" })
    
        }

        const user = await userModel.findOne({$or:[{userName:data.name},{email:data.email}]})
        if(user) return res.json({ message: "user name or email already exist" })

        createData.userName=data.userName
        createData.email=data.email

    
        if(!data.password) return res.json({message:"password is required"}) 
        if (data.password.length < 5 || data.password.length > 15) return res.json({message: "password length should be in range 8-15" });
        if (!(data.password.match(/.*[a-zA-Z]/))) return res.json({ message: "Password should contain alphabets" }) // password must be alphabetic //
        if (!(data.password.match(/.*\d/))) return res.json({ message: "Password should contain digits" })// we can use number also //
        createData.password=data.password
    

    
        await userModel.create(createData)
        res.json({messaage:"user created successfully"})
    
    }
    catch(err){
        res.json({message:err.message})
    }

})




// checking authentication here (login api) 

router.post('/login',async function(req,res){
    try{
        const data =req.body
        if(Object.keys(data).length==0) return res.json({messge:"user credential is required"})
    
        const user = await userModel.findOne({email:data.email, password:data.password})
        if(!user) return res.json({message:"email or password wrong"})
    
        // create jwt token
        const token = jwt.sign({ userId: user._id , userName:user.userName}, 'task1');

        socket = io.connect("http://localhost:3000");

        // Emit the new user  to all connected clients
        socket.emit('user', user.userName);
        res.json({message:"user login successfully",token:token})
    }
    catch(err){
        res.json({message:err.message})
    }


})



router.post('/messages',midd.authenticateUser, async function(req,res){
    try {
        const { message } = req.body;
        if(!message || !message.trim()){
            return res.json({message:"invalid message"})
        }

        // Emit the new message event to all connected clients
        socket.emit('message', {userName:req.userName,message:message});

        const dateTime = new Date();
        const formattedDate = dateTime.toLocaleDateString('en-IN');
        const formattedTime = dateTime.toLocaleTimeString('en-IN');  
        let date=formattedDate +" "+formattedTime


        const mes = await messageModel.create({ user: req.userId, message:message,dateTime:date });

                

        
        res.json({ message:"message sent successfully" });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
})


// Get all messages
router.get('/messages', midd.authenticateUser, async function(req, res){
    try {
      const messages = await messageModel.find().populate('user').sort({dateTime:1})
      res.json({ messages });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
});

  




module.exports=router