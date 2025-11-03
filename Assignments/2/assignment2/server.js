const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
app.use(express.static("public"));









const startServer = () => {
    console.log("STARTING Express web server")     
    console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
}
app.listen(port, startServer)