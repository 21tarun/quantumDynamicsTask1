const express =require('express')
const app = express()
const http =require('http')
const socket =require('socket.io')
const route =require('./routes/route')
const mongoose = require('mongoose')



const server= http.createServer(app)
app.use(express.json());


app.use('/',route)

mongoose.set("strictQuery",true)

mongoose.connect("mongodb+srv://tarun21:tarun1616@cluster0.h0l8mir.mongodb.net/groupChat",{
    useNewUrlParser:true
})
.then(function(){
    console.log("mongodb connected")

    // here socket will work on this "server" server


    const io =socket(server) 
    
    io.on('connection',function(socket){
        console.log('new connection....')
    

        var name2
        socket.on('message',function(msg){
            // console.log(msg)
            
            socket.broadcast.emit('message',msg)
            var data={}
            data.userName=msg.userName
       
            data.message=msg.message

            const dateTime = new Date();

            const formattedDate = dateTime.toLocaleDateString('en-IN');
            

            const formattedTime = dateTime.toLocaleTimeString('en-IN');
            
            data.dateTime=formattedDate +" "+formattedTime
            console.log(data)
            
        })

        
        // for live user
        socket.on('user',async function(userName){
            console.log(userName, " joined the group chat")
            
            
            name2=userName
            socket.broadcast.emit('user',userName)
        })

        // if user is disconnected
        socket.on('disconnect', async (name) => {
            console.log('Disconnected from Socket.IO server');
            console.log(name2)


            // Perform any necessary cleanup or actions here
            socket.broadcast.emit('disName',name2)

        });

    })

})
.catch((err)=>console.log(err))



server.listen(3000, function(){
    console.log("server is running ",3000)
})