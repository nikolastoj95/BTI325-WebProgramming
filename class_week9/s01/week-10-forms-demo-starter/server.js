const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs

// forms: process data received in a req.body
// need this for req.body
app.use(express.urlencoded({ extended: true }));    

app.get("/", (req, res) => {    
    return res.render("home.ejs")
})

// TODO: Make a POST endpoint

app.post("/test",(req,res)=>{
    console.log("Debug: Activing /test end point")
    //get payload data
    console.log("DEBUG. payload DATA from the form")
    console.log(req.body)
    return res.send("Success! Done")
})



// 5 use the req.body to access 
// req.body gets you everything in payload 
/*app.get("/test",(req,res)=> {
    console.log("Data from form:")
    console.log(req.body)
    return res.send("done!")
});*/
// Excercise 1 calulator 

app.get("/ex1Calculator",(req,res)=>{
    return res.render("calculator.ejs")
});

//2. endpoint to recive
//parseFloat(price) *1.13 
// parseInt
app.post("/calculate",(req,res)=>{
    console.log(req.body)

    // getting the price after tax

    // a. getting price

    const price = req.body.textPrice;
    
    return res.render("results.ejs")
});

app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
