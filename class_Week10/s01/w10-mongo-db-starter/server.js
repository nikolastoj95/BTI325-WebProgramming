const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms

// sessions
// setup sessions
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

// +++ 1. Import this library so you can read values from the .env file
require("dotenv").config()   

// +++ 2. Required!
const mongoose = require('mongoose')

// +++  3. Specify your database connection information
// see startServer() function at the bottom of this file

// +++  4. TODO: Define your database table 
// 4a. Schema

// 4b. Model



// +++  5. TODO: Write code to perform CRUD operations on the database table

app.get("/", (req, res) => {    
    return res.render("home.ejs")
})

// Endpoints
// Insert
app.get("/employees/insert", (req,res) => {
    console.log("TODO: Inserting....")
    return res.redirect("/")
})
// Update
app.get("/employees/update", (req,res) => {
    console.log("TODO: Update....")
    return res.redirect("/")
})
// Delete
app.get("/employees/delete", (req,res) => {
    console.log("TODO: Delete....")
    return res.redirect("/")  
})
// Read Examples
app.get("/employees", (req,res) => {
    console.log("TODO: Getting all employees....")    
    return res.redirect("employees.ejs")
})
app.get("/employees/wage/16.60", (req,res) => {
    console.log("TODO: Get minimum wage employees (wage = 16.60)...")
    return res.redirect("/")
})
app.get("/employees/3", (req,res) => {
    console.log("TODO: Get one employee....")
    return res.redirect("/")
})


// +++  5. Create a function that connects to the database BEFORE starting the Express web server.
async function startServer() {    
    try {    

        // +++ 5a. Attempt to connnect to the database using the database connection information you defined in step #2
        await mongoose.connect(process.env.MONGODB_URI)

        // +++ 5b. If tables do not exist in the db, then Mongo will automatically create them

        // +++ 5c.  If db connection successful, output success messages. If fail, go to 5d.
        console.log("SUCCESS connecting to MONGO database")
        console.log("STARTING Express web server")        
        
        // +++ 5d.  At this point, db connection should be successful, so start the web server!
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }
    // +++ 5d. The catch block executes if the app fails to connect to the database     
    catch (err) {        
        console.log("ERROR: connecting to MONGO database")
        // +++ 5e. Output the specific error message
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}
// +++ 6. Execute the function
startServer()



