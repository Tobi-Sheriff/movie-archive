const { moviesData, commentsData } = require('./seedMovies');
const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');
const { checkIfDataExists } = require('../utils/dbUtils');
const env = process.env.NODE_ENV || 'development';

module.exports.seed = async () => {
  if (env === 'test') {
    await seedData();
  } else if (env === 'development') {
    const dataExists = await checkIfDataExists();

    if (!dataExists) {
      await seedData();
    } else {
      console.log('Database already contains data. Skipping seeding.');
    }
  }
}

module.exports.destroy = async () => {
  await commentService.deleteAllComments();
  await movieService.deleteAllMovies();
}


// moviesData and commentsData should be arrays of movie and comment objects respectively
async function seedData() {
  try {
    // Step 1: Seed the movies
    const seededMovies = await movieService.addAllMovies(moviesData);

    // Step 3: Seed the comments
    await commentService.addAllComments(commentsData, seededMovies);
    
  } catch (error) {
    console.error("Error seeding movies and comments data: ", error.message);
  }
}
