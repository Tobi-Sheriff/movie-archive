const { moviesData, commentsData } = require('../seeds/seedMovies');
const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');

module.exports.seed = async () => {
  await initializeMovies();
  await initializeComments();
}

module.exports.destroy = async () => {
  await commentService.destroyComments();
  await movieService.destroyMovies();
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
