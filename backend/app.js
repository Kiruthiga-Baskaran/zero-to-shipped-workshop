const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const comparisonRoutes = require('./routes/comparisonRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: frontendUrl }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
}));

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? 'ok' : 'unavailable',
    database: databaseConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api/comparisons', comparisonRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
