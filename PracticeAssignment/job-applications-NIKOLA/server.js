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

// model and sechma
const personSchema = new mongoose.Schema ({
    name: String,
    password: String,
    isAdmin: Boolean
})
const Person = new mongoose.model("persons",personSchema)

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    isOpen: Boolean
})
const Job = new mongoose.model("jobs", jobSchema)

const appSchema = new mongoose.Schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref: "jobs"},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"persons"}
})
const Application =new mongoose.model("apps",appSchema  )


app.get("/", async (req, res) => {        
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
    const countJ = await Job.countDocuments()
    const countPer = await Person.countDocuments()
    if (countJ &&  countPer === 0) {
        await Job.insertMany([
            {
              title: "Data Analysit",
              description: "Analyize and interpeat data sets, prepare stakeholder presentations", 
              isOpen: true},
             {
              title: "Backend Developer",
              description: "Responsible for building and maintaining RESTful APIs using Node.js and MongoDB.", 
              isOpen: true},
              {
              title: "Frontend Developer",
              description: "Responsible for creating stunning user interfaces for the web.", 
              isOpen: false}
              
        ])

        await Person.insertMany([
                {
                    name: "adamf@eNet.com",
                    password: "password123",
                    isAdmin: true
                },
                {
                    name: "John Blue",
                    password: "johnjohn2",
                    isAdmin: false
                },
                {
                    name: "Celeste Prov",
                    password: "CelesteIsABaby5",
                    isAdmin: false
                },

        ])

        console.log("Person and Jobs collections populated!")


    }else {
        console.log("Collection already populated, skipping")

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