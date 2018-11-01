const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/start.html');
});


app.get('/change', (req, res)=>{
  res.sendFile(__dirname+'/change_page.html');
});

app.use('/', router);

app.listen(5000, ()=> console.log('Server has been started'));
