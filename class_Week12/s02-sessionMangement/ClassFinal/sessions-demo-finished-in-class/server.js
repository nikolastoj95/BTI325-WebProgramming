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


    let loggedIn = false
    if (req.session.userInfo === undefined) {
        // session does not have a userInfo property
        // the user never activated the /submit endpoint
        // there is no user that has an account on our site
        loggedIn = false
    } else {
        // session does HAVE a userInfo property
        // the user did create an account
        // the user should e "logged in"
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

    
    if (loggedIn === true) {
        html += `<h2>User is logged in: ${req.session.userInfo.username}</h2>`
    } else {
        html += `<h2>No user logged in</h2>`
    }


    return res.send(html)
})

app.get("/signup", (req, res) => {
    return res.render("signup.ejs")
})


app.post("/submit", (req,res)=>{
    console.log("DEBUG: Form data is:")
    console.log(req.body)


    // TODO: Call the database and check if the user exists
    /*

    const result = await User.findOne({email:req.body.txtEmail})
    if (result === null) {
        // this user does not exist, so it is safe to create them

        await User.create({...})

         // ask the server to attach the user information to the session
        req.session.userInfo = {
            username: req.body.txtUsername,
            plan: req.body.selPlanType
        }

    } else {
        // there is alreadya user with the given email, so you can't create hte account
        return res.send("ERROR")    
    }



    */



    // ask the server to attach the user information to the session
    req.session.userInfo = {
        username: req.body.txtUsername,
        plan: req.body.selPlanType
    }

    // 
    console.log("DEBUG:  What is in the session variable now?")
    console.log(req.session)

    return res.send("see console for form data")
})



app.get("/page2", (req,res)=>{

    // check if the client is logged in?
    if (req.session.userInfo === undefined) {
       // session does not have a userInfo property
       // if no, show an error
       return res.send("ERROR: You must login to see this page.")
   } else {
        // if yes, show them the page
       return res.render("page2.ejs")
   }
    
})
app.get("/page3", (req,res)=>{   
    // everyone can access this page 


    // assuming that everyone by default will ses ads
    let premium = false


    if (req.session.userInfo !== undefined) {
        // this means someone is logged in
        //  userInfo: { username: 'peter', plan: 'paid' }
        if (req.session.userInfo.plan === "paid") {
            premium = true
        }
    }

    return res.render("page3.ejs", {isPremiumUser:premium})
})


app.get("/logout", (req,res)=>{
    // write the code to reset the session to a new on
    req.session.destroy()
    return res.send("Done!")
})


app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
