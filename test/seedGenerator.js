const fs = require('fs');
const path = require('path');
const moviesFilePath = path.join(__dirname, 'movies.json');
const commentsFilePath = path.join(__dirname, 'comments.json');
const seedMovies = require('../seeds/seedMovies');


module.exports.seed = async () => {
  await seedMovies.initializeMovies(moviesFilePath);
  await seedMovies.initializeComments(commentsFilePath);
}


module.exports.destroy = async () => {
  await fs.promises.unlink(commentsFilePath);
  await fs.promises.unlink(moviesFilePath);
}
