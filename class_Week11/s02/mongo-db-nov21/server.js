const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms

require("dotenv").config()   

// +++ 2. Required!
const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
   name:String,
   isManager:Boolean,
   hourlyRate:Number
})
const Employee = new mongoose.model("employees", employeeSchema)


// TODO:  Add a Job's Database

// -------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------
app.get("/departments", (req,res)=>{
    return res.render("depts.ejs")
})

app.get("/", async (req, res) => {    
   return res.render("home.ejs")
})

app.get("/employees", async (req,res)=>{
    // 1. get all employees
    const results = await Employee.find()
    // sending the array of results to the template
    // under a identifier called empList
    return res.render("employees.ejs", {empList:results})        
})
// show the Add Employee Form
app.get("/employees/insert", (req,res)=>{
    return res.render("add.ejs")
})

// POST endpoint for the Add Employee Form
app.post("/employees/insert", async (req,res)=>{
    // get the form data
    console.log(req.body)

    // get the individula fields and create a user from them

    let checked = false
    if (req.body.txtIsManager === undefined) {
        // the chekcbox was "off"
        checked = false
    } else {
        // the checkbox was "on"
        checked = true
    }


    // call the database function for insertion
    await Employee.create({
        name:req.body.txtName, 
        isManager:checked, 
        hourlyRate:parseFloat(req.body.txtHourlyRate)})

    // send them back to the employees endpoint
    return res.redirect("/employees")

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



