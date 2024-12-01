const { moviesData, commentsData } = require('./seedMovies');
const movieService = require('../../services/movieServices');
const commentService = require('../../services/commentServices');

module.exports.seed = async () => {
  await seedData();
}

module.exports.destroy = async () => {
  await commentService.deleteAllComments();
  await movieService.deleteAllMovies();
}

async function seedData() {
  try {
    for (let i = 0; i < moviesData.length; i++) {
      const seededMovies = await movieService.addMovie(moviesData[i]);

      commentsData[i].movie_id = seededMovies.id;
    }
    await commentService.addAllComments(commentsData);
  } catch (error) {
    console.error("Error seeding movies and comments data: ", error.stack);
  }
}
