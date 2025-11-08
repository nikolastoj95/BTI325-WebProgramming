const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs

// forms: process data received in a req.body
app.use(express.urlencoded({ extended: true }));    

// import from modules
const { students } = require("./data/students.js");

app.get("/", (req, res) => {    
    return res.render("all.ejs", {myStudents:students})
})

app.get("/increase/:name", (req, res)=> {
    
    if (req.params.name === "Alice") {}
    if (req.params.name === "Bob") {}
    if (req.params.name === "Carla") {}

})

app.post("/update/:studentId", (req,res)=>{
    console.log("DEBUG: What is the grade update amount")
    console.log(req.body)

    console.log("DEBUG: Who is this change for?")
    console.log(req.params.studentId)
    
    // do logic to acually update hte grade to the amount in the form

    // a. get the specific student
    // for-loop
    // .find()

    const s = students.find((currStudent)=>{
        if (currStudent.id === req.params.studentId) {
            // found a match so exit
            return true
        } else {
            // keep searching 
            return false
        }
    })

    // .find() function will return the FIRST student that matches the if-statement
    // s = the first student that was found
    // if the student cannot be found, s= undefined

    console.log("DEBUG: What is s?")
    console.log(s)

    // optional validation:
    if (s === undefined) {
        return res.send(`Cannot find the student with id: ${req.params.id}`)
    }

    // b. update their grade
    // // by default, form data is a string, so converting to a number
    // b/c a grade is a number
    s.grade = parseFloat(req.body.txtAmount) 

    // c. respond to client
    // by deafult, we send a success message
    // But this creates a 2 step process for the user if they want to see the update
    // in the ui (press BACK + REFRESH)    
    // return res.send("Grade updated!")

    // option2:  automatically redirect to main
    // so they can see the update without having to manually refresh the page

    // automatically navigate to a different endpoint
    // want to navigate to / endpoint
    // this endpoint has my list of students displayed
    // and i want the user to see that list
    return res.redirect("/")

})

app.get("/exercise", (req,res)=>{
    return res.render("calculator.ejs")
})





app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
