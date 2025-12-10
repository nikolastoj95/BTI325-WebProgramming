const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms

require("dotenv").config()

// sessions
const session = require("express-session")
app.use(session({
    secret: "the quick brown fox jumped over the lazy dog",
    resave: false,
    saveUninitialized: false
}));


// +++ 2. Required!
const mongoose = require('mongoose')

// DB models + schema

const personSchema = new mongoose.Schema({
    name: String,
    password: String,
    isAdmin: {type: Boolean, default: false }
})
const Person = new mongoose.model("peoples",personSchema )

const jobSchema = new mongoose.Schema ({
    title: String,
    description: String,
    isOpen: Boolean
})

const Job = new mongoose.model("jobs", jobSchema)

// application
// everyone application has a user + job 

const appSchema = new mongoose.Schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref:"jobs"},
    user:{type: mongoose.Schema.Types.ObjectId, ref:"peoples"}
})
const Application = new mongoose.model("apps",appSchema)

app.get("/", async (req, res) => {    
    // show the home page
    // not logged in  or logged in

    // Logged in users (non admin) can apply to open jobs
    // Admin users can not apply regarsless of open or not open jobs
    
    const showJobs = await Job.find()
    console.log(showJobs)
    
    return res.render("home.ejs",{job: showJobs})
})

// to apply to jobs take job ID and user ID and insert in Applications
app.get("/job/apply/:jobID", async (req,res)=>{
    const jobID = req.params.jobID
    console.log(jobID)

     await Application.insertMany({
        job: jobID,
        user: '6939807c11f6d4d2d9b58878'
     })
     
    return res.send(`Appled to job ` + jobID )
})



app.get("/applications", async (req, res) => {

    const applications = await  Application.find().populate("job").populate("user")
    console.log(applications)

    return res.render("applications.ejs", {app:applications});
});



// logins + auth
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
app.post("/login", async (req, res) => {
    // endpoint to login

    //user enters name + password 
    // use find (name)
    console.log(req.body)
    //1. search for the name entered in DB
    const user = await Person.findOne({
        name: req.body.name
    })
    console.log(user)

    // 2.if no name was found in DB, create user then
    if (!user) {
        user = await Person.create({
            name: req.body.name,
            password: req.body.password
        })
        // go to step 4
    } 
    //3. if user (name) there, but password is wrong, error
        if (user.password !== req.body.password) {
        console.log("ERROR! Wrong username or password")
        return res.send("ERROR! Name or Password Do not match")
    }

    
    

    // 4. If all matches or user created match -> create a session for that user
    console.log(req.sessionID)
    console.log(req.session)
    //create a session
    req.session.userInfo = {
        _id: user._id.toString(),
        name: user.name,
        admin: user.isAdmin
    }
    console.log(req.session.userInfo)
    console.log(`Session created for this user ${req.session.userInfo.name} `)


    return res.redirect("/")
})

app.get("/logout", (req, res) => {
    req.session.destroy()
    console.log("Logged Out")
    return res.redirect("/")
});

const populateDatabase = async () => {
    // do osmething ehre
     const jobCount =  await Job.countDocuments()
     if (jobCount === 0) {

        await Job.insertMany([
            {
                title: "Front End Developer",
                description: "Create stunning user interfaces for the web",
                isOpen: true
            },
            {
                title: "Back End Developer",
                description: "Create endpoints, using express, node, and mongo",
                isOpen: false
            },
            {
                title: "Data Analysit",
                description: "Clean, anylyize large complex data sets and perpare statjeholder presentatons",
                isOpen: true
            }

        ])
         
        await Person.insertMany([
            {
                name: "Nikola",
                password: "GISniki95",
                isAdmin: false
            },
            {
                name: "Alex",
                password: "password123",
                isAdmin: true
            },
            {
                name: "Celeste",
                password: "celeste5",
                isAdmin: false
            }



        ])

        console.log("Jobs, and persons are populated in DB")

     } else {
        console.log("Jobs and peole already have documents, skipping")
     }

}



async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        populateDatabase()

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