import express from "express";
import connection from "./connection.js";
import {dirname,join} from 'path'
import { fileURLToPath } from "url"; 
import todoSchema from "./models/todo.model.js"

//client path
const client_path = join(dirname(dirname(fileURLToPath(import.meta.url))),"client")
//create the server
const app = express()
//middleware for json data
app.use(express.json());
//port number
const port = 3000

app.use(express.static(client_path))

//add task
app.post('/send-data',async(req,res)=>{
    try{
        console.log(req.body)
        const {task} = req.body
        if(!task){
            return res.status(404).send({error:"Task is required"})
        }
        const data = await todoSchema.create({task})
        res.status(201).send(data)
    }
   catch(err){
    res.status(500).send({error:err})
   }
})

//send the tasks to frontend
app.get('/tasks',async(req,res)=>{
    try{
        const data = await todoSchema.find()
        res.status(200).send(JSON.stringify(data))
    }
    catch(err){
        res.status(500).send({error:err})
    }
})

app.post('/edit/:id',async(req,res)=>{
   
    const {id} = req.params
    let task = req.body.task
    const response = await todoSchema.findByIdAndUpdate(
        id,
        {task},
        {new:true}
    )
    res.status(200).send("Updated")
})

app.get('/delete/:id',async(req,res)=>{
    const {id} = req.params
    await todoSchema.findByIdAndDelete(
        id,
        {new:true}
    )
    res.status(200).json("Worked")
})



//connection to databse and also running the server
connection().then(()=>{
    app.listen(port,()=>{
        console.log("Server Running")
    })
})
