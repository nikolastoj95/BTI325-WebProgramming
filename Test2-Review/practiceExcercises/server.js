const express = require('express');
const app = express();
const port = process.env.PORT|| 8080

const path = require("path");
app.use(express.static("public"));

const scores = [45, 80, 32, 90, 60];
const items = [100,200,300]
const expenses = [50, 75, 100, 25];

app.get('/param/:type', (req,res)=> {
    console.log(req.params)
    console.log(Number (req.params.type))
    console.log(typeof req.params.type)
    console.log(typeof Number (req.params.type))
    return res.send(`Running`)
})

//excerise 1 filter
// given scores array, create new array of scores greater than or equal to 60

app.get("/scores", (req,res) => {
    const results = scores
                .filter((score) => score >= 60 )
    const gre_eq_60 = scores
            .filter((score) => {
            if (score >= 60 ) {
                return true
            } 
    });
    console.log(gre_eq_60);
    console.log(results)


    return res.send(results)
});

// ex2 - map
// Return a new array with prices including 20% tax.
app.get("/map",(req,res)=> {
   

    const with_Tax = items
                    .map((item) => (item * 0.20) + item)
    const with_tax_other = items
                            .map ((item) => {
                                return ((item * 0.20) + item)
                            })

    console.log(with_Tax)
    console.log(with_tax_other)
    return res.send(with_Tax)


});

// ex3  find
//Find the product with name === 'Mouse'

app.get("/find",(req,res)=> {
    const products = [
      { id: 1, name: "Keyboard" },
      { id: 2, name: "Mouse" },
      { id: 3, name: "Monitor" },
    ];
    const results =  products
        .find((prod) => prod.name === 'Mouse')
    console.log(results)
    return res.send(results)
})

// Ex4 reduce
//const expenses = [50, 75, 100, 25];
// calulate total expense
app.get("/reduce",(req,res) => {
    const total = expenses
                    .reduce((num, acc) => num + acc , 0)
    console.log(total)
    return res.send(total)

})
//ex5 TailWind

app.get('/tailwind',(req,res) =>{
    return res.sendFile(path.join(__dirname,"index.html"))
});


const startServer = () => {
    console.log(`Server started at http://localhost:${port}`);
    console.log(`Control + C to exit server`);
};
app.listen(port, startServer);
