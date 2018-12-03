/* eslint-disable max-len */
const express = require('express');
const app = express();
const lessM = require('less-middleware');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(lessM(__dirname + '/less', {dest: (__dirname + '/static')}));
app.use(express.static(__dirname + '/static'));


const recipes = [
  {
    title: 'Рецепт 1: Рогалики с начинкой из варенья',
    id: 'recipe-1',
    adress: 'img/nach1.jpg',
    add: 'first rogalick',
    ind: 'Приготовьте рогалики с вареньем. Берите для этого блюда любое – яблочное, смородиновое или апельсиновое, но единственное правило состоит в том, чтобы варенье было достаточно густым, иначе начинка вся останется не деке.',
    head: 'Требуемые ингредиенты:',
    items: ['Творога  350 гр', 'Мука 460 грамм', 'Соды, гашенная лимонным соком – 1 ложка', 'Сахара 80 грамм', 'Яичный желток 1 шт.'],
  },
  {
    title: 'Рецепт 2: Рогалики с начинкой из мармелада',
    id: 'recipe-2',
    adress: 'img/nach2.jpg',
    add: 'rogalick secon',
    ind: 'Достаточно необычными и вместе с тем вкусными получатся рогалики, если вы положите кусочек мармелада в них как начинку. Можете взять слоеный цветной мармелад, тогда десерт получится и вкусным, и красивым.',
    head: 'Требуемые ингредиенты:',
    items: ['420 грамм муки', 'Дрожжей 1 ст.л', 'Яичный желток 1 шт. (для смазывания изделий)', 'Сахарный песок 120 грамм', 'Молока 220 мл'],
  },
  {
    title: 'Рецепт 3: Рогалики с начинкой из сгущенки',
    id: 'recipe-3',
    adress: 'img/nach3.jpg',
    add: 'rogalick third',
    ind: 'Если вы решили приготовить рогалики  со сгущенкой, то лучше взять «варенку». Она более густая по консистенции и точно не покинет лакомство во время приготовления.',
    head: 'Требуемые ингредиенты:',
    items: ['Муки 460 грамм', 'Сахара 150 грамм', 'соль', 'Сгущенка вареная густая', 'Дрожжи сухие 1 столовая ложка'],
  },
  {
    title: 'Рецепт 4: Рогалики с начинкой из яблок',
    id: 'recipe-4',
    adress: 'img/nach4.jpg',
    add: 'forth rogalick',
    ind: 'Выпечку можно готовить со свежими фруктами – клубникой, смородиной, сливой. Приготовим рогалики с яблоком. Советуем вам выбирать фрукты сладких сортов.',
    head: 'Требуемые ингредиенты:',
    items: ['Муки 450 грамм', 'Сахара 140 грамм', 'Воды минеральной 320 мл', 'Дрожжей 1 ст.л.', '3 яблока', 'Соль, корица, масло растительное'],
  }];

app.get('/', (req, res) => {
  res.render('start', {recipes});
});

app.get('/change_page', (req, res) => {
  res.render('change_page');
});

app.use(bodyParser.urlencoded({extended: true}));

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, (err, database) => {
  const dat = database.db('usersdb');
  const ObjectID = require('mongodb').ObjectID;
  if (err) return console.log(err);

  app.post('/notes', [
    check('title').isLength({min: 5}, {max: 15}).withMessage('must be at least 5 chars long'),
    check('text').isLength({min: 5}, {max: 80}),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()});
    }
    const note = {text: req.body.text, title: req.body.title};
    const doc = await dat.collection('notes');
    const add = await doc.insertOne(note);
    try {
      res.send(await add.ops[0]);
    } catch (err) {
      console.log(err);
      res.send({'error': 'An error has occurred'});
    }
  });


  app.get('/notes/', async (req, res) => {
    const doc = await dat.collection('notes');
    const data = await doc.find();
    const arrays = await data.toArray();
    try {
      res.send(await arrays);
    } catch (err) {
      console.log(err);
      res.send({'error': 'An error has occurred'});
    }
  });

  app.get('/notes/:id', [
    check('id').isMongoId(),
  ], async (req, res) => {
    const err = await validationResult(req);
    const errors = await err.isEmpty();
    if (errors == true) {
      const id = req.params.id;
      const details = {'_id': new ObjectID(id)};
      const doc = await dat.collection('notes');
      const findData = await doc.findOne(details);
      try {
        res.send(await findData);
      } catch (erro) {
        console.log(erro);
        res.send({'error': 'An error has occurred'});
      }
    } else {
      console.log('Id error');
      res.end('Sorry, but ID error');
    }
  });

  app.put('/notes/:id', [
    check('id').isMongoId(),
  ], [
    check('title').isLength({min: 5}, {max: 15}).withMessage('must be at least 5 chars long'),
    check('text').isLength({min: 5}, {max: 80}),
  ], async (req, res) => {
    const request = await validationResult(req);
    const errors = await request.isEmpty();
    if (errors == true) {
      const id = req.params.id;
      const details = {'_id': new ObjectID(id)};
      const changeContent = {text: req.body.text, title: req.body.title};
      const doc = await dat.collection('notes');
      const findData = doc.findOneAndUpdate(details, {$set: changeContent});
      res.send(await findData);
    } else {
      console.log('Id error');
      res.end('Sorry, but ID error or length is wrong');
    }
  });


  app.delete('/notes/:id', [
    check('id').isMongoId(),
  ], async (req, res) => {
    const request = await validationResult(req);
    const errors = await request.isEmpty();
    if (errors == true) {
      const id = req.params.id;
      const details = {'_id': new ObjectID(id)};
      const doc = dat.collection('notes');
      const delData = doc.deleteOne(details);
      res.send(delData);
    } else {
      console.log('Id error');
      res.end('Sorry, but ID error');
    }
  });

  app.delete('/notes/', async (req, res) => {
    const doc = await dat.collection('notes');
    const allDel = await doc.drop();
    res.send(await allDel);
  });
});


app.listen(5000, ()=> console.log('Server has been started'));
