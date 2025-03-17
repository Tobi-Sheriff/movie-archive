if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

const express = require('express');
const moviesRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

const cors = require('cors');

const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 8001 : 8000;
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.URL,
  methods: "GET, POST, PUT, DELETE",
  credentials: true
}
app.use(cors(corsOptions));

app.use('/v1/movies', moviesRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});

if (!process.env.JEST_WORKER_ID) {
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  module.exports = { server, app };
} else {
  module.exports = { app };
}