if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const moviesRoutes = require('./routes/movies');
const { seed } = require('./seeds/seedGenerator');

const PORT = process.env.NODE_ENV === 'test' ? 8001 : 8000;

seed();
app.use(express.json());
app.use('/v1/movies', moviesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}`);
})


module.exports = { app, server };