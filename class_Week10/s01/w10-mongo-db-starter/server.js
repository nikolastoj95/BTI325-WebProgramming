const HTTP_PORT = process.env.PORT || 8080;

const { name } = require("ejs");
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

// +++  4. TODO: Define your database table // 9.23am

// 4a. Schema
const employeeSchema = new mongoose.Schema({
   name:String,
   isManager:Boolean,
   hourlyRate:Number
})
// create a collection in Mongo called “empployees”
// every document in that collection will follow the employSchema
const Employee = new mongoose.model("employees", employeeSchema)
//// "employees" has to match the collection in mongo altas


// 4b. Model



// +++  5. TODO: Write code to perform CRUD operations on the database table

app.get("/", (req, res) => {    
    return res.render("home.ejs")
})

// Endpoints
// Insert
// if have await in line, needs asynb in endpoint name def
app.get("/employees/insert", async (req,res) => {
    
    console.log("TODO: Inserting....")
    await Employee.create({name:"Celeste", isManager:false, hourlyRate:17.00})
    await Employee.create({name:"Lily", isManager:false, hourlyRate:17.00})
    return res.redirect("/")
})
// Update
app.get("/employees/update", async (req,res) => {
    console.log("TODO: Update....")
    await Employee.findByIdAndUpdate("6916a3654f60bf1ec2614e8e",{name: 'Nikola', hourlyRate: 26.60}, {new:true}) 
    return res.redirect("/")
})
// Delete
app.get("/employees/delete",  async (req,res) => {
    console.log("TODO: Delete....")
    await Employee.findByIdAndDelete("6916a3392c1011e41eb8848b")
    await Employee.findByIdAndDelete("691499952297434a00a510fb")
    await Employee.findByIdAndDelete("6916a3392c1011e41eb8848d")
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
        // process.env.MONGODB_URI refers to that .env file to that MONGODB_URI varable 

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



