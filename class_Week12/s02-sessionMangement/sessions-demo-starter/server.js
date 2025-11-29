const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs

// forms: process data received in a req.body
app.use(express.urlencoded({ extended: true }));    

// REQUIRED: setup sessions
const session = require('express-session')
app.use(session({
    // random string, used for generating and encrypting the session ID
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  
   resave: false,
   saveUninitialized: true
}))


app.get("/", (req, res) => {
    console.log("Session ID:" + req.sessionID)    
    console.log("Session data:")
    console.log(req.session)

    let html = `
        <h1>Welcome to my website!</h1>
        <p>Your session id is: ${req.sessionID}</p>
        
        
        <ul style="margin-top:40px;">
            <li><a href="/signup">Signup for account</a></li>
            <li><a href="/page2">Go to Page 2</a></li>
            <li><a href="/page3">Go to Page 3</a></li>            
        </ul>        
    `
    return res.send(html)
})

app.get("/signup", (req, res) => {
    return res.render("signup.ejs")
})
app.post("/submit", (req,res)=>{
    console.log("DEBUG: Form data is:")
    console.log(req.body)
    return res.send("see console for form data")
})
app.get("/page2", (req,res)=>{
    return res.render("page2.ejs")
})
app.get("/page3", (req,res)=>{    
    return res.render("page3.ejs")
})

// POST ENDPOINT for hte form
app.post("/submit", (req,res)=>{
    console.log("What did you get from the form:")
    console.log(req.body)

    // convert the checkbox selection to a boolean
    let showAds = false
    if (req.body.cbShowAds === "on") {
        showAds = true
    }
    
    // save this data to the session varaible
    req.session.x = showAds
    req.session.y = req.body.selColor
    return res.redirect("/page2")
})

app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
