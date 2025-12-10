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
//person
const personSchema = new mongoose.Schema ({
    name: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
})
const Person = new mongoose.model("persons",personSchema)

//job
const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    isOpen: Boolean
})
const Job = new mongoose.model("jobs", jobSchema)

//application
// an app has a job
// an app had a person
const appSchema = new mongoose.Schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref: "jobs"},
    user: {type: mongoose.Schema.Types.ObjectId, ref:"persons"}
})
const Application =new mongoose.model("apps",appSchema)

  

app.get("/", async (req, res) => {   
      
    // view all jobs
    let loggedIn = false
    if (req.session.userInfo === undefined) {
        loggedIn = false
        // database
        const showJob = await Job.find({})
        console.log(showJob)
        return res.render("home.ejs", {job: showJob , loggedIn})
        // go to ejs home to show the jobs
   
   }
        loggedIn = true
        const nameSession = req.session.userInfo.name
        const currUser = req.session.userInfo 
       
        const showJob = await Job.find({})
        return res.render("home.ejs", {loggedIn, name:nameSession, currUser, job: showJob })
  


     
})
// GET
//apply for a job
app.get("/apply/job/:jobID", async (req,res)=>{
    const currUser = req.session.userInfo;
    console.log(currUser)

    //TODO Only logged in users can apply
    if (req.session.userInfo === undefined) {
        console.log("Can not apply, you are not logged")
        return res.redirect("/")
    }
    //TODO Ensure that admins can not apply
    if (currUser.admin === true) {
        //return res.send("You can not apply cause you are admin")
        console.log("You can not apply cause you are admin")
        return res.redirect("/")
    }


 // bring in param job id
    const jobID = req.params.jobID;
    console.log(jobID)

    
    await Application.create({
        job: jobID,
        user: currUser._id
    })
    return res.redirect("/")
});

//GET
//show application page
app.get("/applications", async (req, res) => {
    if (req.session.userInfo === undefined) {
        return res.redirect("/")
    }

   const currUser = req.session.userInfo;
   console.log(currUser)

   let applications = []

    if (currUser.admin === true ) {
        //admin users can see all apps
        applications = await Application.find().populate("job").populate("user")
   } else {
        // showing only logged in user
        // logged in user can see only there apps
        // find filter is the curr user id finding the user field in application if that id matchs
        applications = await Application.find({user: currUser._id}).populate("job").populate("user")
   }

    //const showapp = await Application.find().populate("job").populate("user")
    console.log(applications)
    return res.render("applications.ejs",{app:applications});
});


app.get("/login", (req, res) => {
    // to show form
    res.render("login.ejs");
});
app.post("/login", async (req, res) => {
    // endpoint to login
    // to retirve form fields
     console.log(req.body)
     console.log(typeof req.body.password)

     //1. find a user, find name n DB
      let user = await Person.findOne({
        name: req.body.name
      })
      console.log(user)

      // 2. if name not in db create the user
      if (!user) {
        user = await Person.create({
            name: req.body.name,
            password: req.body.password
        })
        console.log("user created, procede to log in")
      } else   {
            //3. email there but  password wrong 
            if (user.password !== req.body.password) {
                console.log("error")
                return res.redirect("/login")
            } 
      } 
        // matches  all name + password
        //update session with this user 
        console.log(req.sessionID)
        console.log(req.session)

       // create a user session
        req.session.userInfo = {
            _id: user._id.toString(),
            name: user.name,
            admin: user.isAdmin
        }
        console.log(req.session.userInfo)

    return res.redirect("/")
})

app.get("/logout", (req, res) => {
    req.session.destroy()
    console.log("logged out")
    return res.redirect("/")
});

const populateDatabase = async () => {
    // do osmething ehre
    //const countJ = await Job.countDocuments()
    const countPer = await Person.countDocuments()
    if (countPer === 0) {
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
              isOpen: false},
              
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
                }
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