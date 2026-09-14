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

app.get('/routes/type/:type', (req, res) => {
    const type = req.params.type;
  
    const filePath = path.join(__dirname, 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
  
    const filtered = routes.filter((route) => route.type === type);
    res.json(filtered);
  });

app.get('/routes/wall/:wall', (req, res) => {
    const wall = req.params.wall;
  
    const filePath = path.join(__dirname, 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
  
    const filtered = routes.filter((route) => route.wall === wall);
    res.json(filtered);
  });

  app.get("/routes/:id", (req, res) => {
    const id = Number(req.params.id);
  
    const filePath = path.join(__dirname, "data", "routes.json");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const routes = JSON.parse(fileContent);
  
    const route = routes.find((route) => route.id === id);
  
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
  
    res.json(route);
  });

module.exports = app;