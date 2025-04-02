import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
const __dirname = join(dirname(dirname(fileURLToPath(import.meta.url))), "client");
const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let collection;

async function connectDB() {
    try {
        await client.connect();
        const db = client.db("toDo");
        collection = db.collection("tasks");

        app.listen(3000, () => {
            console.log("running");
        });
    } catch (error) {
        console.error(error.message);
    }
}

connectDB();

//add data to database 
app.post("/add-task", async (req, res) => {
    try {
        await collection.insertOne(req.body);
        res.status(200).redirect("/");
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//get data api
app.get("/getdata",async (req,res)=>{
    const data = await collection.find({}).toArray()
    res.send(JSON.stringify(data))
    
})

//update-data
app.post("/update/:id",async (req,res)=>{
    const {id} = req.params
    await collection.updateOne({_id:new ObjectId(id)},{$set:req.body})
    res.redirect('/')
})

//delete-data
app.get("/delete/:id",async (req,res)=>{
    const {id} = req.params
    await collection.deleteOne({_id:new ObjectId(id)})
    res.status(200).json({message:"Deleted Success"})
})
