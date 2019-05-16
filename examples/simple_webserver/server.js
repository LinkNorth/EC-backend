const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/hello', function(req, res) {
  res.send('hello');
});

const PORT = 8080;
app.listen(PORT, function() {
  console.log('Listening on', PORT);
});
