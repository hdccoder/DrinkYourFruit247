const {
  seed,
  client,
} = require('./db');

try{
  require('../env')
}catch(er){
  console.log('if running locally add env.js file')
}

const express = require('express');
const app = express();
app.use(express.json({limit: "200mb"}));
app.engine('html', require('ejs').renderFile)
const path = require('path');

app.get('/', (req, res)=> res.render((path.join(__dirname, '../public/index.html')), {GITHUB_CLIENT: process.env.GITHUB_CLIENT}));

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api', require('./api'));

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await seed();
  console.log('create your tables and seed data');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
