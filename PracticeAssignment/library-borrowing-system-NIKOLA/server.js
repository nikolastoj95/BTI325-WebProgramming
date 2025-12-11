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

// user collection
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isAdmin: {type:Boolean, default: false}
})
const User = new mongoose.model("users",userSchema)
// books collection
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    quantity: Number,
    isAvailble: Boolean
})
const Book = new mongoose.model("books",bookSchema)

// borrowings collection // relationship
// each borrow record contains a user, and a book

const borrowSchema = new mongoose.Schema({
      book: {type: mongoose.Schema.Types.ObjectId, ref: "books" },
      user: {type: mongoose.Schema.Types.ObjectId, ref: "users" }
 })
 const Borrow = new mongoose.model("borrows",borrowSchema)


app.get("/", async (req,res)=>{
    // home endpoint
    // view all books in library

    const currUser = req.session.userInfo
    const showBooks = await Book.find()

    return res.render("home.ejs", {book:showBooks, currUser})
})

app.get("/borrow/:bookID", async (req,res)=>{
    const currUser = req.session.userInfo
    const getBooks = await Book.find()

    if (currUser === undefined) {
        console.log("ERROR! Must be Logged in to Borrow Book!")
       return res.redirect("/")
    } else if (currUser.admin === true) {
        console.log("ERROR! You are a Admin can not borrow Books")
       return res.redirect("/")
    }
    // let user borrow book, are logged in, not a admin
    const bookID = req.params.bookID
    console.log(bookID)

    await Borrow.insertMany({
        book: bookID,
        user: currUser._id //whose ever user._id is that
    })

    return res.send(`Book borrowed!, ${bookID}`)
})

app.get("/borrowlist",async (req,res)=> {
    const currUser = req.session.userInfo;
    if (currUser === undefined) {
        console.log("ERROR: Need to be Logged IN to view borrow list")
        return res.redirect("/")
    }
    let borrowedBooks = []

    if (currUser.admin === true ) {
        borrowedBooks = await Borrow.find().populate("book").populate("user")
        console.log(borrowedBooks)
    }else {
         borrowedBooks = await Borrow.find({user: currUser._id}).populate("book").populate("user")
         console.log(borrowedBooks)
    }
    

    //return res.send("show list, find all")
    return res.render("borrow.ejs", {bookLoan: borrowedBooks, currUser})
})

//LOGIN -AUTH 
app.get("/login",(req,res)=>{
    // show the login form
    return res.render("login.ejs")
})

app.post("/login", async(req,res)=>{
    //to get login details from form
    console.log(req.body)
    //1. find the name in DB if it is match login

    let user = await User.findOne({
        email: req.body.email
        
    })
    console.log(user)

    // 2. no user was found in DB make a new user
    if (!user) {
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
    } else{
        //3. user there but wrong password
        if (user.password !== req.body.password) {
            console.log("ERROR! Wrong password Try again")
            return res.redirect("/login")
        }
    }

    // 4. user found, password matchs -> MATCH Proceed to LOGIN

    //make a user session
    console.log(req.sessionID)
    console.log(req.session)

    // attach user to current session
    req.session.userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.isAdmin
    }
    console.log(req.session.userInfo )
    console.log(req.sessionID)


    return res.redirect("/")
})

app.get("/logout",(req,res)=>{
    req.session.destroy()
    console.log("loggout session distroyed")
    

    return res.redirect("/")
})


const populateDatabase = async () =>{

    const countB = await  Book.countDocuments()

    if (countB === 0){

        await Book.insertMany([
            {
                title: "Hungar Games Book One" ,
                author: "Suzanne Collins",
                quantity: 5,
                isAvailble: true
            },
             {
                title: "Atomic Habits" ,
                author: "James Clear",
                quantity: 3,
                isAvailble: true
            },
             {
                title: "Catching Fire-Book2 " ,
                author: "Suzanne Collins",
                quantity: 0,
                isAvailble: false
            }

        ])

        await User.insertMany([
            {
                name: "Alice",
                email: "alice@gmail.com",
                password: "alice123",
                isAdmin: false
            },
            {
                name: "Celeste",
                email: "celesteJuicyGirl@hotmail.com",
                password: "CelesteIsBaby5",
                isAdmin: false
            },
            {
                name: "Roger",
                email: "rogerMan@libraryNet.ca",
                password: "password1",
                isAdmin: true
            }
        ])
        console.log("books and users collection successfully populated with data!")
    } else {
        console.log("already contains data, skipping")
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