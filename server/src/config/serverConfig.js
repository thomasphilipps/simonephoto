const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json('API online')
})

module.exports = app;