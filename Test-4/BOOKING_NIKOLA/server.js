const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      // ejs
app.set('views', __dirname + '/views') //ejs vercel
app.use(express.urlencoded({ extended: true })); // forms

require("dotenv").config()

app.use(express.static(__dirname + '/public')) // css vercel

const session = require("express-session")
app.use(session({
    secret: "the quick brown fox jumped over the lazy dog",
    resave: false,
    saveUninitialized: false
}));

// ===== DATABASE =====
const mongoose = require('mongoose')

const managerSchema = new mongoose.Schema({
    name: String
})
const Manager = mongoose.model("managers", managerSchema)

const timeslotSchema = new mongoose.Schema({
    time: String,
    customer: String       
})
const Timeslot = mongoose.model("timeslots", timeslotSchema)


// ===== ROUTES =====

// 1. Home Page endpoints
app.get("/", async (req, res) => {    
    // get all the timeslots from the database and display in UI.
    const slots = await Timeslot.find()  
    
    
    return res.render("home.ejs", {timeslots:slots})
})
app.get("/bookingForm",(req,res)=>{
    return res.render("bookingForm.ejs")
})


app.get("/book/:id",(req,res)=>{
    //endpoint to show bookingForm
    const slotID = req.params.id
    return res.render("bookingForm.ejs", {slotID})
})

app.post("/book/:id", async (req,res)=>{   
    //process booking form
    console.log( "Time Slot ID picked: " + req.params.id)  
    console.log(req.body.txtCustomer)
    const timeSlotID = req.params.id
    const customerName = req.body.txtCustomer
    await Timeslot.findByIdAndUpdate(timeSlotID, {
        customer: customerName
        }
    )
    return res.send(`Success, your reservation number is ${timeSlotID}. <a href="/">Home</a>`)
})
app.get("/remind/:id", async (req,res)=>{   
    const remindID = req.params.id
    console.log(remindID)
    console.log(req.sessionID)


    
    
    return res.send(`Reminder feature activated! <a href="/">Home</a>`)
})

// 2. Manage Bookings endpoints
app.get("/manage", async (req,res)=>{
    // booking screen, only a manager can see this
    const currUser = req.session.userInfo
    if (currUser === undefined) {
        console.log("You are not a manager, manager only can see this")
        return res.redirect ("/")
    }
    const slots = await Timeslot.find()
    return res.render("manageBookings.ejs", {timeslots:slots})
})
app.get("/cancel/:id", async (req,res)=>{ 
    // cancel slot, part of booking screen, only a manager can see this
    const currUser = req.session.userInfo
    if (currUser === undefined) {
        console.log("You are not a manager, manager only can see this")
        return res.redirect ("/")
    }
    const slotID = req.params.id;
    console.log(slotID) 

    await Timeslot.findByIdAndUpdate(slotID, {
        $unset: {
             customer: ""
        }
    })
    

    return res.send(`Reservation cancelled. <a href="/manage">Manage Bookings?</a>`)
})


// 3. Login/Logout endpoints
app.get("/login", async(req,res)=>{
    // shows login form
    return res.render("login.ejs")
})

app.post("/login", async (req,res)=>{  
    //handle login data
    console.log(req.body)

    //1. search and find in DB  the name entered
    let users = await Manager.findOne({
        name: req.body.name
    })

    if (users === null) {
        console.log("ERROR! Invalid Manager Name try again")
        return res.redirect("/login")
    }  
    // otherwise name is match in Manager DB save in session, login 
    console.log(req.sessionID)
    console.log(req.session)

    req.session.userInfo ={
        _id: users._id,
        name: users.name
    }
    console.log(req.session.userInfo)
    console.log("Mananger Logged In")

    return res.redirect("/manage")    
})
app.get("/logout", (req,res) => { 
    req.session.destroy()    
    console.log("Logged out")
    return res.redirect("/")
})


// ===== DATABASE POPULATION =====
const populateDatabase = async () => {       
    // Create managers
    const managerCount = await Manager.countDocuments({});
    if (managerCount === 0) {
        await Manager.create({name:"admin"})            
        console.log("DEBUG: Managers created.");
    } else {
        console.log("DEBUG: Managers collection already contains documents, so skipping insert of rows.");
    }

    // Create timeslots
    const timeslotCount = await Timeslot.countDocuments({});
    if (timeslotCount === 0) {
        await Timeslot.insertMany([
            { time: "18:00", customer: "" },
            { time: "18:30", customer: "alice" },
            { time: "19:00", customer: "bob" },
            { time: "19:30", customer: "" },            
        ]);
        console.log("DEBUG: Timeslots created.");
    } else {
        console.log("DEBUG: Timeslots collection already contains documents, so skipping insert of rows.");
    }
}

// ===== START SERVER =====

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        populateDatabase();

        console.log("SUCCESS connecting to MONGO database");
        console.log("STARTING Express web server");

        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: http://localhost:${HTTP_PORT}`);
        });
    } catch (err) {
        console.log("ERROR: connecting to MONGO database");
        console.log(err);
        console.log("Please resolve these errors and try again.");
    }
}

startServer()
