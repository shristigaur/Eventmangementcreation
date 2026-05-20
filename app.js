const express = require('express');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
  });
});

app.use('/', eventRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    message: 'Route not found',
  });
});

module.exports = app;