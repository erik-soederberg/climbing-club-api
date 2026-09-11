const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/routes', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
    res.json(routes);
  });

module.exports = app;