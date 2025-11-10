const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  // css files
app.set("view engine", "ejs");      //ejs

// forms: process data received in a req.body
// need this for req.body
app.use(express.urlencoded({ extended: true }));    
//displays the form
app.get("/", (req, res) => {    
    return res.render("home.ejs")
})

// TODO: Make a POST endpoint

app.post("/test",(req,res)=>{
    const airportinput = req.body.airport;
    const name = req.body.txtName;
    const age = req.body.age;
    console.log("Debug: Activating /test endpoint")

    //get payload data
    console.log("DEBUG. Payload DATA from the form")
    console.log(req.body)
    // JS object: req.body = {txtName: Nikola,  txtAge:90}

    // you can access the individual form fields using JS syntax
    console.log(`Name: ${req.body.txtName}`)
    console.log(`Age: ${req.body.age}`)
    console.log(`Airport ${req.body.airport}`)
    console.log(airportinput + ' ' + name + ' ' + age  )

    if (airportinput === 'YYZ') {
        return res.send(`Domestic! Done!`)
    } else {
        return res.send(`International! Done!`)
    }
    //return res.send("Success! Done")
})



// 5 use the req.body to access 
// req.body gets you everything in payload 

//6.Done

// Excercise 1 calulator 
// render the form itself
app.get("/ex1Calculator",(req,res)=>{
    return res.render("calculator.ejs")
});

//2. endpoint to recive data from /ex1Calculator form
//parseFloat(price) *1.13 
// parseInt
app.post("/calculate",(req,res)=>{
    console.log(req.body)

    // getting the price after tax

    // a. getting price
    const pName = req.body.txtPName
    const price = parseFloat(req.body.price);
    console.log( typeof pName)
    console.log( typeof price)

    const price_aftTax = (price * 1.13).toFixed(2);
    return res.render("results.ejs",{x: pName, y: price_aftTax})
});

app.listen(HTTP_PORT, () => { console.log(`server listening on: http://localhost:${HTTP_PORT}`) });
