const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'data', 'setters.json');
    const setters = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(setters);
  });

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
  
    const filePath = path.join(__dirname, '..', 'data', 'setters.json');
    const setters = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const setter = setters.find((setter) => setter.id === id);
  
    if (!setter) {
      return res.status(404).json({ error: 'Setter not found' });
    }
  
    res.json(setter);
  });

router.post('/', (req, res) => {
    const { name, email } = req.body;
  
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const filePath = path.join(__dirname, '..', 'data', 'setters.json');
    const setters = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
    const newId = setters.length > 0
      ? Math.max(...setters.map((setter) => setter.id)) + 1
      : 1;
  
    const newSetter = { id: newId, name, email };
    setters.push(newSetter);
  
    fs.writeFileSync(filePath, JSON.stringify(setters, null, 2));
    res.status(201).json(newSetter);
  });

module.exports = router;
