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

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})


module.exports = { app, server };
