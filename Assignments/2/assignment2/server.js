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

const startServer = () => {
    console.log("STARTING Express web server")     
    console.log(`server listening on: http://localhost:${port}`) 
}
app.listen(port, startServer)