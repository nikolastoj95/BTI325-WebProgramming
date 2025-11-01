const express = require("express")
const app = express()
const port = process.env.PORT || 8080

app.use(express.static("public"));
const path = require("path")

const { products } = require("./modules/products.js")


// TODO: Required for EJS
app.set("view engine", "ejs")


app.get("/", (req,res)=>{
  const html = `
    <ul>
      <li><a href="/example1">Example 1 - res.sendFile</a></li>
      <li><a href="/example2">Example 2 - res.send</a></li>
      <li><a href="/demo1">EJS Demo</a></li>
    </ul>
  `
  return res.send(html)
})

app.get("/demo1", (req,res)=>{
  // products comes from modules/products
  return res.render("demo1.ejs", {items: products})
})

app.get("/example1", (req,res) => {
  return res.sendFile(path.join(__dirname, "views/index.html"))
})

app.get("/example2", (req,res) => {

  let html = ""
  for (let i = 0; i < products.length; i++) {
    html +=`
      <div>
        <p>Name: ${products[i].name}</p>
        <p>Price: ${products[i].price}</p>
        <p>Rating: ${products[i].starRating}<p>
      </div>
      <hr/> <!-- don't actaully use this in real life, use css to make a line -->
    `
  }
  return res.send(html)
})

const startServer = () => {
   console.log(`The server is running on http://localhost:${port}`)
   console.log(`Press CTRL + C to exit`)
}
app.listen(port, startServer)
