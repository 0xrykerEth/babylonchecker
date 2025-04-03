const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const checker = require('./checker')


app.use(checker);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = http.createServer(app);

server.listen(3000, ()=> {
    console.log('Server is running on port 3000')
})
