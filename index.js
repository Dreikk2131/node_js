const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/start.html');
});

app.get('/download', (req, res) => {
  res.download(__dirname + '/static/img/nach1.jpg');
});

app.get('/change', (req, res) => {
  res.sendFile(__dirname+'/static/change_page.html');
});

app.listen(5000, ()=> console.log('Server has been started'));
