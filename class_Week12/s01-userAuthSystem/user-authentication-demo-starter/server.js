const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views")
app.use(express.urlencoded({ extended: true })); //forms

require("dotenv").config()   

// +++ 2. Required!
const mongoose = require("mongoose")


// TODO: Create a user collection
// step 1 create collection to store users
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    userType: String
})
const User = new mongoose.model("users",userSchema)
// step 2: create Account



// -------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------
app.get("/", async (req, res) => {        
    return res.render("home.ejs")
})
// Step 2 Create an Account
app.post("/create-account", async (req,res)=>{

    console.log(req.body)
    // TODO: Implement create account logic
    // 1. Get form data
    // 2. Search database collection for a document with same email
    // 3. If found, then user exists so output error
    // 4. If not found, then create a new user

    // Check if email already exists in your users
    // Create Read Update Delete?

    // trys to find a email entered in the database
    const document = await User.findOne({email: req.body.txtEmail})

    if (document === null) {
        // no user with this email is found
        //1. create a new user, (insert the user into DB)
        const userAdded = await User.create({
            email:req.body.txtEmail,
            password: req.body.txtPassword,
            userType: req.body.selUserType
        })
        // return success message, user added!, redirect page
        return res.send(`Done! ${userAdded._id}`)
    } else {
        // there is already user with this email, in DB already 
        return res.send(`ERROR! There already exists a user with the email`)
    }


})
//Step3  Login a User (authentication)
app.post("/login", async (req,res)=>{
   
    // TODO: Implement logic to check user credentials
    // 1. Get form data
    // 2. Search database collection for a document with same email AND password
    // 3. If found, then user entered correct details, so navigate them to another page (or show success)
    // 4. If not found, then user entered wrong details, so show error

    console.log(req.body)
    //1. search DB for the entered email, password User
    const result = await User.findOne({
        email: req.body.txtEmail,
        password: req.body.txtPassword
    })

    if (result === null) {
        // wrong info entered, no match 
        console.log("no match! no user exists with this info")
        //2. Can not find matching user
        return res.send(`ERROR!, Invaild Username or password`)
    } else {
        //3. found a user matching the details
        console.log("user Found SUCESS vaild user")
        return res.redirect("/page2")

    }




})

app.get("/page2", (req,res)=>{
    return res.render("page2.ejs")
})


async function startServer() {    
    try {    
        
        await mongoose.connect(process.env.MONGODB_URI)

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


