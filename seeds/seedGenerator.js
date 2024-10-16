const { moviesData, commentsData } = require('./seedMovies');
const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');
const { checkIfDataExists } = require('../utils/dbUtils');
const env = process.env.NODE_ENV || 'development';

module.exports.seed = async () => {
  if (env === 'test') {
    await initializeMovies();
    await initializeComments();
  } else if (env === 'development') {
    const dataExists = await checkIfDataExists();

    if (!dataExists) {
      await initializeMovies();
      await initializeComments();
    } else {
      console.log('Database already contains data. Skipping seeding.');
    }
  }
}

module.exports.destroy = async () => {
  await commentService.deleteAllComments();
  await movieService.deleteAllMovies();
}

async function initializeMovies() {
  try {
    await movieService.addAllMovies(moviesData);
  } catch (error) {
    console.error("Error seeding movies data: ", error);
  }
}

async function initializeComments() {
  try {
    await commentService.addAllComments(commentsData);
  } catch (error) {
    console.error("Error seeding comments data: ", error);
  }
}
