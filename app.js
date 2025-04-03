const http = require('http');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const checker = require('./checker')


app.use(checker);


const server = http.createServer(app);

server.listen(3000, ()=> {
    console.log('Server is running on port 3000')
})