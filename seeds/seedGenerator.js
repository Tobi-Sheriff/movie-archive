const { moviesData, commentsData } = require('./seedMovies');
const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');
const { checkIfDataExists } = require('../utils/dbUtils');
const env = process.env.NODE_ENV || 'development';
const { sequelize } = require('../models')

module.exports.seed = async () => {
  if (env === 'test') {
    sequelize.options.logging = false;

    await seedData();
  } else if (env === 'development') {
    sequelize.options.logging = true;

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
    for (let i = 0; i < moviesData.length; i++) {
      const seededMovies = await movieService.addMovie(moviesData[i]);

      const store_type = process.env.STORE_TYPE;

      if (!store_type) {
        throw new Error("STORE type not defined");
      }
      
      if (store_type == 'file') {
        commentsData[i].movie_id = seededMovies.id;
      } else if (store_type == 'db') {
        commentsData[i].movie_id = seededMovies.dataValues.id;
      }
    }
    await commentService.addAllComments(commentsData);


  } catch (error) {
    console.error("Error seeding movies and comments data: ", error.stack);
  }
}
