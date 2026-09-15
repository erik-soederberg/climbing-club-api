const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
    res.json(routes);
  });

router.get('/type/:type', (req, res) => {
    const type = req.params.type;
  
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
  
    const filtered = routes.filter((route) => route.type === type);
    res.json(filtered);
  });

router.get('/wall/:wall', (req, res) => {
    const wall = req.params.wall;
  
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
  
    const filtered = routes.filter((route) => route.wall === wall);
    res.json(filtered);
  });

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
  
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const routes = JSON.parse(fileContent);
  
    const route = routes.find((route) => route.id === id);
  
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
  
    res.json(route);
  });

router.post('/', (req, res) => {
    const { name, wall, type, grade, holdColor, setterId } = req.body;
  
    if (!name || !wall || !type || !grade) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const routes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
    const newId = routes.length > 0
      ? Math.max(...routes.map((route) => route.id)) + 1
      : 1;
  
    const newRoute = { id: newId, name, wall, type, grade, holdColor, setterId };
    routes.push(newRoute);
  
    fs.writeFileSync(filePath, JSON.stringify(routes, null, 2));
    res.status(201).json(newRoute);
  });

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { name, wall, type, grade, holdColor, setterId } = req.body;
  
    if (!name || !wall || !type || !grade) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const routes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = routes.findIndex((route) => route.id === id);
  
    if (index === -1) {
      return res.status(404).json({ error: 'Route not found' });
    }
  
    routes[index] = {
      ...routes[index],
      name,
      wall,
      type,
      grade,
      holdColor,
      setterId,
    };
  
    fs.writeFileSync(filePath, JSON.stringify(routes, null, 2));
    res.json(routes[index]);
  });

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
  
    const filePath = path.join(__dirname, '..', 'data', 'routes.json');
    const routes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
    const exists = routes.some((route) => route.id === id);
    if (!exists) {
      return res.status(404).json({ error: 'Route not found' });
    }
  
    const updated = routes.filter((route) => route.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  
    res.status(204).send();
  });

module.exports = router;
