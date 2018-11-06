const express = require('express');
const app = express();

app.set('views', './pugF');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/pugF'));

app.get('/', (req, res) => {
  res.render('start');
});

app.get('/download', (req, res) => {
  res.download(__dirname + '/static/img/nach1.jpg');
});

app.get('/change_page', (req, res) => {
  res.render('change_page');
});

app.listen(5000, ()=> console.log('Server has been started'));
