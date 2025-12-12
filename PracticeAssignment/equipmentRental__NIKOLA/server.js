const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms

// setup sessions
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

require("dotenv").config()   
const mongoose = require('mongoose')

// TODO: update this section with Vercel specific deployment code
app.use(express.static("public"));  // css files



// TODO: Put your model and schemas here


// TODO: Modify your endpoint logic
app.get("/", async (req, res) => {  
    return res.render("login.ejs")
})
app.post("/login", async (req, res)=>{
    return res.redirect("/cars")
})
app.get("/logout", async (req,res) => {
    return res.redirect("/")
})
app.get("/cars", async (req, res) => {  
    return res.render("cars.ejs")
})
app.get("/book", async (req,res)=>{
    return res.render("bookingForm.ejs")
})
app.post("/book", async (req,res)=>{
    // get booking form data 
    return res.redirect("/cars")
})


async function startServer() {
    try {    
        // TODO: Update this
        await mongoose.connect(process.env.MONGO_URI)

        console.log("SUCCESS connecting to MONGO database")
        console.log("STARTING Express web server")        
        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }
    catch (err) {        
        console.log("ERROR: connecting to MONGO database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}
startServer()



