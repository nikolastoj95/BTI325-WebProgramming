const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

const {DESTINATION, locations} = require("./modules/data.js")

// needed for EJS
app.set("view engine", "ejs"); 

app.get("/",(req,res)=>{
    return res.render("index.ejs",{d: DESTINATION, l:locations});
})

app.get("/ex",(req,res)=> {
    return res.render("example.ejs",{d: DESTINATION, l:locations})
})

// to delete a location
app.get("/locations/delete/:id",(req,res)=>{
    const locationID = req.params.id;
    console.log(locationID)
    console.log(typeof Number(locationID))
    return res.send("Deleted")
})

const startServer = () => {
    console.log("STARTING Express web server")     
    console.log(`server listening on: http://localhost:${port}`) 
}
app.listen(port, startServer)