const express = require('express');
const app = express();
const port = process.env.PORT|| 8080

app.get('/', (req,res)=> {
    console.log(`Works`)
    return res.send(`Running`)
})


const startServer = () => {
    console.log(`Server started at http://localhost:${port}`);
    console.log(`Control + C to exit server`);
};
app.listen(port, startServer);
