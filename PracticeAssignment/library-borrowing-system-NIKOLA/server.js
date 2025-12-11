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
    isAvailble: {type:Boolean, default: false}
})
const Book = new mongoose.model("books",bookSchema)

// borrowings collection // relationship
// each borrow record contains a user, and a book

const borrowSchema = new mongoose.Schema({
      book: {type: mongoose.Schema.Types.ObjectId, ref: "books" },
      user: {type: mongoose.Schema.Types.ObjectId, ref: "users" }
 })
 const Borrow = new mongoose.model("borrows",borrowSchema)


app.get("/",(req,res)=>{
    return res.render("home.ejs")
})


const populateDatabase = async () =>{}

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