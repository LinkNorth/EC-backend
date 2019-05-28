const express = require('express');


const app = express();

app.use(function(req, res, next) {
  if (req.is('json')) {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
        next();
      } catch (e) {
        res.status(400).end();
      }
    });
  } else {
    next();
  }
}); 

app.post('/echo', (req, res) => {
  res.send(req.body);
});

app.listen(8091);
