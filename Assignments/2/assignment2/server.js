const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

const {DESTINATION, locations} = require("./modules/data.js");

// needed for EJS templates
app.set("view engine", "ejs"); 

//HOME Layout, the destination and locations
//GET
app.get("/",(req,res)=>{
    return res.render("index.ejs",{d: DESTINATION, l:locations});
})

// To delete a location
//POST
app.post("/locations/delete/:id",(req,res)=>{
    const locationID = parseInt(req.params.id);
    console.log(locationID)
    
    for (let i = 0; i < locations.length; i++){
        if (locationID === locations[i].id) {
            // when location if found and matchs given one remove from data
            // leave loop after
            locations.splice(i,1); 
            break;
        };
    };
   
    //delete happened
    console.log(`id ${locationID} is deleted`);
    // redirect to home page again
    return res.redirect('/');
});

const startServer = () => {
    console.log("STARTING Express web server")     
    console.log(`server listening on: http://localhost:${port}`) 
};
app.listen(port, startServer);