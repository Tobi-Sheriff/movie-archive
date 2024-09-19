const express = require('express');
const app = express();
const moviesRoutes = require('./routes/movies');


app.use(express.json());

app.use('/v1/movies', moviesRoutes);


// app.listen('3000', () => {
//   console.log('Listening on port 3000');
// })


module.exports = app;
