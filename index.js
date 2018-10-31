const express = require('express');
const app = express();
const router = new express.Router();

const arr = [];

router.get('/', (req, res) => {
  res.send(arr);
});

router.post('/add/:name', (req, res)=>{
  arr.push(req.params.name);
  res.send('OK');
});

router.delete('/delete/:name', (req, res)=>{
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

app.use('/', router);

app.listen(5000, ()=> console.log('Server has been started'));
