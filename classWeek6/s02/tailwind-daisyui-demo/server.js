const express = require("express")
const app = express()
const port = process.env.PORT || 8080

const path = require("path");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"))
})
app.get("/examples/text", (req, res) => {
    res.sendFile(path.join(__dirname, "views/01-text.html"))
})
app.get("/examples/widths", (req, res) => {
    res.sendFile(path.join(__dirname, "views/02-widths.html"))
})
app.get("/examples/borders", (req, res) => {
    res.sendFile(path.join(__dirname, "views/03-borders.html"))
})

app.get("/examples/colors", (req, res) => {
    res.sendFile(path.join(__dirname, "views/04-colors.html"))
})
app.get("/examples/themes", (req, res) => {
    res.sendFile(path.join(__dirname, "views/05-themes.html"))
})
app.get("/examples/layout", (req, res) => {
    res.sendFile(path.join(__dirname, "views/06-layout.html"))
})
app.get("/examples/prose", (req, res) => {
    res.sendFile(path.join(__dirname, "views/07-prose.html"))
})
app.get("/examples/hero", (req, res) => {
    res.sendFile(path.join(__dirname, "views/08-hero.html"))
})
app.get("/examples/footer", (req, res) => {
    res.sendFile(path.join(__dirname, "views/09-footer.html"))
})
app.get("/examples/navbars", (req, res) => {
    res.sendFile(path.join(__dirname, "views/10-navigation.html"))
})


const startServer = () => {
 console.log(`The server is running on http://localhost:${port}`)
 console.log(`Press CTRL + C to exit`)
}
app.listen(port, startServer)