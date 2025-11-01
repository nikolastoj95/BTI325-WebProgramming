const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.static("public"));  

// needed for EJS
app.set("view engine", "ejs");      


// get the data from the module
const {students, chatMessages} = require("./modules/data.js");


// This endpoint shows server side code works
app.get("/", (req, res) => {        
    return res.render("index.ejs")
})


// This endpoint shows how res.render() works.
// In the lecture recording, I did this code in the / endpoint
// But for clarity, I moved it to another endpoint: demo1
app.get("/demo1", (req,res)=>{
    return res.render("mytestfile.ejs")

    // What does the res.render(...) do?
    // 1. Navigate to the file:  views/mytestfile.ejs 
    // 2. Inside the file, execute each line of code
    // 3. For each line of code, output the corresponding HTML
    // 4. The final html should look like this:

        // <!DOCTYPE html>
        // <html lang="en">
        // <head>
        // </head>  
        // <body>
        //     <h1>Here is my page</h1>
        //     <p>hello 0</p>
        //     <a href="/0">Click here</a>
        //     <p>hello 1</p>
        //     <a href="/1">Click here</a>
        //     <p>hello 2</p>
        //     <a href="/2">Click here</a>
        // </body>
        // </html>  

    // 5. Send this html back to the client
    
    // You can view the HTML in the browser by doing:
    // - Right Click > View Page Source
    // - Alternatively, you can look at the Network > Response tab in the Developer tools
    
})

// This endpoint shows how to send values from the endpoint to the template
// In the lecture recording, I did this code in the / endpoint
// But for clarity, I moved it to another endpoint: demo2 
app.get("/demo2", (req,res)=>{    
    // example of sending values to the template
    return res.render("demo2.ejs", 
        {   x:3, 
            y:"Fidosdfsdfsdfdsfdsf", 
            z:[9,30,55], 
            a:students[0].name,     // students[0] is an individual student from module/data.ejs
            b:students[0].course,   
            myList:students // array of objects from module/data.js
 
        })

    // How this code works:
    // 1. You can send variable data from the endpoint to the template using the {}
    // 2. You must provide a unique identifier for the data
    //    In example above, the identifiers are: (x, y, z, a, b, myList)
    // 3. In the template, these values are treated like variables
    // 4. This means you can:
    //      a. Output the values using: <%= %>
    //      b. Use the values in your programming logic, using <% %>
})


app.get("/daisytest", (req,res)=>{
    // demos how to use daisyui components
    return res.render("daisy-examples.ejs", {m: chatMessages})
})



const startServer = () => {
    console.log("STARTING Express web server")     
    console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
}
app.listen(HTTP_PORT, startServer)




