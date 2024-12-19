if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

const express = require('express');
const moviesRoutes = require('./routes/movies');
const cors = require('cors');

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 8001 : 8000;
app.use(express.json());

const corsOptions = {
  origin: process.env.URL,
  methods: "GET, POST, PUT, DELETE",
  credentials: true
}
app.use(cors(corsOptions));

app.use('/v1/movies', moviesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = { app, server };