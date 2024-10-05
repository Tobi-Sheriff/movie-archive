const express = require('express');
const app = express();
const moviesRoutes = require('./routes/movies');


app.use(express.json());

app.use('/v1/movies', moviesRoutes);


// app.listen('8000', () => {
//   console.log('Listening on port 8000');
// })


module.exports = app;
