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
    // not logged in     
    return res.render("home.ejs")
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
});
app.post("/login", async (req, res) => {
    // endpoint to login
    return res.send("login post endpoint")
})

app.get("/logout", (req, res) => {
    return res.send("logout")
});

app.get("/applications", async (req, res) => {
    return res.render("applications.ejs");
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