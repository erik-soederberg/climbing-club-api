const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'setters.json');
    const setters = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(setters);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const filePath = path.join(__dirname, '..', 'data', 'setters.json');
    const setters = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const setter = setters.find((setter) => setter.id === id);

    if (!setter) {
      return res.status(404).json({ error: 'Setter not found' });
    }

    res.json(setter);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
});

module.exports = router;
