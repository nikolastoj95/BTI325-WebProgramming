const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
// for ejs
app.set("view engine", "ejs");
//for forms config
app.use(express.urlencoded({extended: true}));

const {items} = require ("./modules/data.js");
const name = "Nikola";
const monthlyFee = 45.00;

let steps = [
  { step: "Register",        done: true  },
  { step: "Choose plan",     done: false },
  { step: "Purchase",        done: false },
  { step: "Receive Product", done: false },
];


app.get("/",(req,res)=>{
    return res.render("map.ejs")
})

app.post("/cost",(req,res)=>{
    const months = parseInt(req.body.txtMonth);
    const membType = req.body.txtType;

    console.log(req.body)
    console.log(months)
    console.log(membType)

    if( membType ===  'p') {
        return res.send(`Membership Cost is $ 1000.00 `)
    }else if (months > 12 ) {
        const newMonthlyFee = monthlyFee - 25
        return res.send(`Membership Cost is $  ${newMonthlyFee}`)
    } else if ( months <= 12) {
        return res.send(`Membership Cost is $  ${monthlyFee}`)
    } else {
         return res.send(" ")
    }

})

// Question1 
// pass a varable called username
app.get("/name/:username", (req,res)=>{
    //const name  = req.params.username
    console.log(name)
    
    
    return res.render("profile.ejs", {username:  name})

})

//question2
//Write an EJS snippet that loops through an array called items 
// and prints each one inside a <li>.

app.get("/items",(req,res)=>{
    return res.render("profile.ejs", {items: items, username:  name})
});
app.post("/create-user",(req,res)=> {
    console.log(req.body.txtName)
    console.log(req.body.txtAge)
    return res.send("Sent") 
});
const startServer = () =>{
     console.log(`Server Running on http://localhost:${port}`)
     console.log(`Press Contorl + C to exit`)
};
app.listen(port,startServer);