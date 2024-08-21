import express from "express"
import mongoose from "mongoose"
 
import Videos from "./dbModel.js"
 
import cors from "cors"

 


 
 
// app config 
const app = express()
const Port =5000
 

const connection_url = 'mongodb+srv://admin:rZ3ai6sNuXDZVaAu@cluster0.kuql1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
 

//middlwares
 


app.use(cors({
    origin: "http://localhost:3000", // Adjust as needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));
app.use(express.json({ limit: '1000mb' })); // Increase size limit
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(express.json())
//db conifg


//api endpoints
 
app.get("/",(req,res)=>res.status(200).send(`mongo db  ${Port }...`))

app.get("/v1/posts",async(req,res)=>{
    try{
      const DataFromBaseDeDonne = await Videos.find()
      
      res.status(200).send(DataFromBaseDeDonne)
    }
    catch(err){
        console.log(`thi eroor in ${err}`)
        res.status(500).send(err)
    }
})

app.post("/v2/posts", async (req, res) => {
    // Post request to add a video document to the videos collection
    const dbVideos = req.body;

    try {
        const data = await Videos.create(dbVideos);
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send(err);
    }   
});

app.get("/v2/posts", async (req, res) => {  
    // Post request to add a video document to the videos collection
         try{
                const data =await Videos.find()
                res.status(200).send(data)
         }
         catch(err){
            res.status(500).json({message:"Internal server",error:err})
            console.log(`this ereur by ${eror}`)
         }
    
    
});

// Fetch the dat fro front end

app.put("/v3/posts/:channel", async (req, res) => {
    try {
        const updatedData = await Videos.updateMany(
            { channel: req.params.channel },  // Filter by channel
            { $set: req.body }                // Update fields with data from request body
        );

        // Check if any documents were updated
        if (updatedData.matchedCount === 0) {
            return res.status(404).json({ message: "No data found for this channel" });
        }

        res.status(200).json({ message: "Data updated successfully", updatedCount: updatedData.modifiedCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error updating data", error: err });
    }
});




// listen 


app.listen(Port,()=>console.log(`listening on localhost:${Port}`))
