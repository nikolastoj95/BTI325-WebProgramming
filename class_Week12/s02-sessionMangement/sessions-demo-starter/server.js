const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs

// forms: process data received in a req.body
app.use(express.urlencoded({ extended: true }));    


//1. npm install express-session

// REQUIRED: setup sessions
//2.
const session = require('express-session')
app.use(session({
    // random string, used for generating and encrypting the session ID
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  
   resave: false,
   saveUninitialized: true
}))
// after this getting
// req.sessionID
//req.session


app.get("/", (req, res) => {
    console.log("Session ID:" + req.sessionID)    
    console.log("Session data:")
    console.log(req.session)
    
    let loggedIn = false
    if(req.session.userInfo === undefined){
      // session does not have a userInfo property
      // the user never activited the /submit endpoint
      // ther is no user that has an account on out site
      loggedIn = false  
    } else {
        // session does HAVE a userInfo property
        // the user did create an account
        // the user should be "logged In"
        loggedIn = true

    }








    let html = `
        <h1>Welcome to my website!</h1>
        <p>Your session id is: ${req.sessionID}</p>
        
        
        <ul style="margin-top:40px;">
            <li><a href="/signup">Signup for account</a></li>
            <li><a href="/page2">Go to Page 2</a></li>
            <li><a href="/page3">Go to Page 3</a></li>            
        </ul>        
    `
    if (loggedIn === true ){
        html += `<h2>User is Logged In: ${req.session.userInfo.username}</h2>`
    }else {
        html += `<h2>User Not Logged In</h2>`
    }
    return res.send(html)
    //return res.send(`Session id is ${req.sessionID}`)
})

app.get("/signup", (req, res) => {
    return res.render("signup.ejs")
})

app.post("/submit", (req,res)=>{
    console.log("DEBUG: Form data is:")
    console.log(req.body)
    // ask the server to attach the user info to the session

    req.session.userInfo = {
        username: req.body.txtUsername,
        plan: req.body.selPlanType
    }
    console.log(`DEBUG: What is in thr session variable now`)
     console.log(req.session)
    return res.send("see console for form data")
})

app.get("/page2", (req,res)=>{
    // check if the client is logged In (it is logged in if have extra property userInfo in cookie)
    if (req.session.userInfo === undefined){
        // session does not have a userInfo property 
        //if no, show a error
        return res.send(`ERROR!: You can not see this page because you not logged In`)
    } else{
        // if yes, show them page
        return res.render("page2.ejs")

    }    
})
app.get("/page3", (req,res)=>{    
    // anyone can access this page

    let premium = false
    if (req.session.userInfo != undefined){
        //this meas someone is logged in 
        if (req.session.userInfo.plan === "paid") {
            premium = true
        }
    }

    return res.render("page3.ejs", {isPremiumUser: premium})
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
app.get("/logout", (req,res)=>{
    // write the code to reset the session to a new
    req.session.destroy()
    return res.send("Done!")
})


app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
