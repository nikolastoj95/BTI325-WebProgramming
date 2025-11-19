const app = express();
const express = require('express');
const port = process.env.PORT || 8080;
// for ejs
app.set("view engine", "ejs");

app.get("/", (req,res)=>{
    return res.render("home.ejs")

})

const startServer = () =>{
     console.log(`Press Contorl + C to exit`)
    console.log(`Server Running on http://localhost:${port}`)
   
};
app.listen(startServer, port);