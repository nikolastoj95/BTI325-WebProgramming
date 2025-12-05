const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();

app.get("/", (req, res) => {        
    let html = `      
        <h1>Welcome to my Webpage!</h1>
        <p>Put some stuff here!</p>
        <h3>Nikola Something Else!</h3>
        <a href="/page2">Go to Page 2</a>
    `
    return res.send(html)
})

// endpoint
//GET
///page2
app.get("/page2", (req,res)=>{
    let html = `
        <h1>Welcome to my Page 2!</h1>
        <a href="/">Go Home!</a>
    `
    return res.send(html)
})

const startServer = async () => {    
    try {    
        console.log("STARTING Express web server")        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }
    catch (err) {        
        console.log("Please resolve these errors and try again.")
        console.log(err)
    }
}
startServer()
