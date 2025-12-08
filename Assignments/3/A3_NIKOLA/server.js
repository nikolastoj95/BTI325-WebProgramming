const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.set("view engine", "ejs");      //ejs
app.set('views', __dirname + '/views')// ejs vercel
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
app.use(express.static(__dirname + '/public'));  // css files



// TODO: Put your model and schemas here

const carSchema = new mongoose.Schema({
    model: String,
    imageUrl: String,
    returnDate: { type: String, default: ''} ,

    // 1 to 1 relationship 
    rentedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null}

})
const Car = new mongoose.model("cars",carSchema)

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
const User = new mongoose.model("users",userSchema)

// TODO: Modify your endpoint logic
app.get("/", async (req, res) => {  
    return res.render("login.ejs")
})
app.post("/login", async (req, res)=>{
     console.log(req.body)
    // const eMail = req.body.email
    // const password = req.body.password

    //console.log(eMail + ' and ' + password)
    //1. search DB for entered info in users collection Find user by email
    let user = await User.findOne({
        email: req.body.email
    })
    
    // 2.  If email not found -> create User
    if (!user) {
        user = await User.create({
            email: req.body.email,
            password: req.body.password
        })  
        //new user is auto logged in below
    } else {
        //3. If email found but password wrong -> error stay on login
        if (user.password !== req.body.password){
        //alert('ERROR! Wrong username or password!')
        return res.redirect("/")
    }

    }
    
    

    //4. Email + password match -> success

    console.log(req.sessionID)
    console.log(req.session)
    
    req.session.userInfo = {
        _id: user._id.toString(),
        email: user.email
    }
     console.log(req.session.userInfo.email)
     



    // const result = await User.findOne({
    //     email: req.body.email,
    //     password: req.body.password
    // })
    //console.log(result)
    // find it now
    // if (result === null) {
    //     // no user found create them
    //     await User.insertOne({
    //         email: req.body.email,
    //         password: req.body.password
    //     })
    //     console.log('created user')

    // } else {
    //     // user found, matching, log them in 
    //     console.log(result)
    //     return res.redirect("/cars")
    // }
    return res.redirect("/cars")
})
app.get("/logout", async (req,res) => {
    req.session.destroy()
    return res.redirect("/")
})
app.get("/cars", async (req, res) => {  
    let loggedIn = false
    if (req.session.userInfo === undefined ) {
        loggedIn = false
        return res.redirect("/")
    } else {
        loggedIn = true
        const userSession = req.session.userInfo
        const session = req.session.userInfo.email
        console.log(userSession)
        const cars =  await Car.find({}).populate('rentedBy')
        return res.render("cars.ejs", {car:cars, loggedIn, user: userSession, session })
    }
});
app.get("/book/:carid", async (req,res)=>{
    let loggedIn = false
    if(req.session.userInfo === undefined) {
        loggedIn = false
        return res.redirect("/")
    } else {

        loggedIn= true
        //const session = req.session.userInfo.email
        const carId = req.params.carid;
        console.log(carId)
        const car = await Car.findById(carId)
        console.log(car)
        return res.render("bookingForm.ejs",{car})
    }  
})
app.post("/book/:carid", async (req,res)=>{
    // get booking form data 
    console.log(req.body)
    console.log(req.body.date)
    const carID = req.params.carid
    const date = req.body.date

    //the current user from session
    const currUser = req.session.userInfo
    console.log(currUser.email + ' and ' +  currUser._id)

    //update the cars rended by and return date
    await Car.updateOne(
        { _id:carID },
        {$set: {rentedBy: currUser._id, returnDate: date}}
        
    )
    return res.redirect("/cars")
})

app.get("/car/:carid/return", async(req,res)=> {
    const carID = req.params.carid;
    //const currUser = req.session.userInfo

    await Car.updateOne (
        {_id:carID },
        {$unset: {rentedBy: null, returnDate: ''}}

    )
    return res.redirect("/cars")



})

const prepopulateDB =  async () => {
    const count = await Car.countDocuments()

    if ( count === 0 ) {

        await Car.insertMany([
            {
              model: "Honda Civic", 
              imageUrl: "https://di-uploads-pod11.dealerinspire.com/appletreehonda/uploads/2018/07/2018-Honda-Civic-Header-Hero.png",
              returnDate: "",
              rentedBy: null
            },
             {
              model: "Telsa Model 3", 
              imageUrl: "https://www.tesla.com/ownersmanual/images/GUID-B5641257-9E85-404B-9667-4DA5FDF6D2E7-online-en-US.png",
              returnDate: "",
              rentedBy: null

            },
             {
              model: "Mercedes C400", 
              imageUrl: "https://i.pinimg.com/736x/56/8b/3f/568b3fa0f30bb612c7040b6adef75362.jpg",
              returnDate: "",
              rentedBy: null
            },
             {
              model: "Hyundai Elantra", 
              imageUrl: "https://content-images.carmax.com/qeontfmijmzv/2eNGdQLX4jmD3xNHx3IBnv/60036560e1da4d21c3b5eb1b57dd7daa/elantra-gen-c.png?w=2100&fm=webp",
              returnDate: "",
              rentedBy: null
            },
             {
              model: "Ford Mustang", 
              imageUrl: "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Ford-Mustang-Exterior-126883.jpg?wm=0&q=80",
              returnDate: "",
              rentedBy: null
            }
            
        ])
        console.log("DEBUG: populated cars collection ");
    } else {
        console.log("DEBUG: Cars collection contains documents, cars skipping ");
    }

}


async function startServer() {
    try {    
        // TODO: Update this
        await mongoose.connect(process.env.MONGO_URI)

        prepopulateDB()

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



