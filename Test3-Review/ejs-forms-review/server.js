const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// for ejs
app.set("view engine", "ejs");

app.get("/", (req,res)=>{
    return res.render("home.ejs")

})

const startServer = () =>{
    console.log(`Server Running on http://localhost:${port}`)
    console.log(`Press Contorl + C to exit`)
};
app.listen(startServer, port);