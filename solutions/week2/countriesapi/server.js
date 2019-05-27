const express = require('express');
const app = express();


const data = require('./countries.json');


app.use(function(req, res, next) {
  let start = Date.now();
  res.once('finish', () => {
    let end = Date.now() - start;
    console.log(req.method, req.url, res.statusCode, end);
  });
  next();
});


app.get('/countries', (req, res) => {
  const qs = req.query;
  let page = parseInt(qs.page);
  let size = parseInt(qs.size);
  let name = qs.name;

  if (!page) page = 1;
  if (!size) size = 20;

  let countries = data.countries;
  
  if (name) {
    countries = countries.filter(country => {
      return country.indexOf(name) !== -1;
    });
  }

  let results = countries.slice((page - 1) * size, page * size);

  res.json({data: results});
});


app.listen(3034);

