const express = require('express');
const app = express();
const arr = [];
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/start.html');
});


app.get('/add/:name', (req, res)=>{
  arr.push(req.params.name);
  res.send('OK');
});

app.get('/delete/:name', (req, res)=>{
  let item = 0;
  while (item<=arr.length) {
    let y = arr.indexOf(req.params.name); //eslint-disable-line
    if (req.params.name===arr[item]) {
      arr.splice(y, 1);
    } else if (y === -1) break;
    item++;
  }
  res.send('OK');
});

app.listen(5000, ()=> console.log('Server has been started'));
