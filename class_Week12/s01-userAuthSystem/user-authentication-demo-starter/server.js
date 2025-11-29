const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views")
app.use(express.urlencoded({ extended: true })); //forms

require("dotenv").config()   

// +++ 2. Required!
const mongoose = require("mongoose")


// TODO: Create a user collection


// -------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------
app.get("/", async (req, res) => {        
    return res.render("home.ejs")
})

app.post("/create-account", async (req,res)=>{

    // TODO: Implement create account logic
    // 1. Get form data
    // 2. Search database collection for a document with same email
    // 3. If found, then user exists so output error
    // 4. If not found, then create a new user
})

app.post("/login", async (req,res)=>{
   
    // TODO: Implement logic to check user credentials
    // 1. Get form data
    // 2. Search database collection for a document with same email AND password
    // 3. If found, then user entered correct details, so navigate them to another page (or show success)
    // 4. If not found, then user entered wrong details, so show error
})

app.get("/page2", (req,res)=>{
    return res.render("page2.ejs")
})


async function startServer() {    
    try {    
        
        await mongoose.connect(process.env.MONGODB_URI)

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


