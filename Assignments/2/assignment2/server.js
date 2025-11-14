const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
require("dotenv").config()
const mongoose = require('mongoose');

app.use(express.static("public"));

const {DESTINATION, loc} = require("./modules/data.js");

//mongoose sechma
const locationsSchema = new mongoose.Schema({
    id: Number,
    name: String,
    category: String,
    address: String,
    comments: String,
    image: String
});
const MemorablePlaces = new mongoose.model("vistlocations", locationsSchema);
//" collection_name " has to be same in MOngo DB, or it will be created as new and has to be in lower case

// needed for EJS templates
app.set("view engine", "ejs"); 

//HOME Layout, the destination and locations
//GET
app.get("/", async (req,res)=>{
    // get all locations
    const locations = await MemorablePlaces.find();
    //console.log(locations)
    return res.render("index.ejs",{d: DESTINATION, l:locations});
})

//add a location
app.get("/add", async (req,res) =>{
    await MemorablePlaces.create({id:2, name: "Royal Ontario Museum (ROM)", category: "Museum", address: "100 Queen's Park, Toronto, ON M5S 2C6", comments: "Crystal facade is wild; loved the dinosaurs wing.", image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxO4N9ypoicgIaAmXEG9n3gm0xyg0xWqfKceR-BT8tPJxTG1UPmuEwhWv_9RbYX5hkdhrK22mQWTGGpEewSyf6iETfVpAAnMPSQT5KD9Y4ECGQEPwiM9qx1gsYA5RmzAQ7mlWje=s1360-w1360-h1020-rw"})
    return res.redirect("/")
})

// To delete a location
//GET
app.get("/locations/delete/:id", async (req,res)=>{
    const locationID = parseInt(req.params.id);
    console.log(locationID)
    //id=1

    await MemorablePlaces.deleteOne({id:locationID})
    
   
   /*
    for (let i = 0; i < MemorablePlaces.length; i++){
        //console.log(MemorablePlaces[i].id)
        if (locationID === MemorablePlaces[i].id) {
            await MemorablePlaces.deleteOne({id: MemorablePlaces[i].id})
            // when location if found and matchs given one remove from data
            // leave loop after
            //loc.splice(i,1); 
            break;
        };
    };
    */
   
    //delete happened
    console.log(`id ${locationID} is deleted`);
    // redirect to home page again
    return res.redirect('/');
});
/*
const abc = () => {
}
function def () {
}*/
 async function startServer ()  {
    try {
        //connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI)

          console.log(`Success Connecting to Mongo Database`)
          console.log("STARTING Express web server")     
          console.log(`server listening on: http://localhost:${port}`) 

    } catch (err) {
        console.log("ERROR: connecting to MONGO database")
        // +++ 5e. Output the specific error message
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
};

app.listen(port, startServer);