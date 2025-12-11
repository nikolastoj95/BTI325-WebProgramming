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

    const showBooks = await Book.find()

    return res.render("home.ejs", {book:showBooks})
})

app.get("/borrow/:bookID", async (req,res)=>{
    const bookID = req.params.bookID
    console.log(bookID)

    await Borrow.insertMany({
        book: bookID,
        user: '693a0e896cc865ae2f643edc' //Alice
    })

    return res.send(`Book borrowed!, ${bookID}`)
})

app.get("/borrowlist",async (req,res)=> {

    const borrowedBooks = await Borrow.find().populate("book").populate("user")
    console.log(borrowedBooks)

    //return res.send("show list, find all")
    return res.render("borrow.ejs", {bookLoan: borrowedBooks})
})

//LOGIN -AUTH 
app.get("/login",(req,res)=>{
    // show the login form
    return res.render("login.ejs")
})


const populateDatabase = async () =>{

    const countB = await  Book.countDocuments()

    if (countB === 0){

        await Book.insertMany([
            {
                title: "Hungar Games Book One" ,
                author: "Suzanne Collins",
                isAvailble: true
            },
             {
                title: "Atomic Habits" ,
                author: "James Clear",
                isAvailble: true
            },
             {
                title: "Catching Fire-Book2 " ,
                author: "Suzanne Collins",
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