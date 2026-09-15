const express = require('express');
const routesRouter = require('./routes/routes');
const settersRouter = require('./routes/setters');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/routes', routesRouter);
app.use('/setters', settersRouter);

module.exports = app;
