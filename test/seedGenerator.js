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

async function initializeMovies () {
  try {
      movieService.seedMovie(moviesData);
    // for (let i = 0; i < moviesData.response.length; i++) {
    //   movieService.addMovie(moviesData.response[i]);
    // }
  } catch (error) {
    console.error("Error seeding movies data: ", error);
  }
}

async function initializeComments (){
  try {
    commentService.seedComment(commentsData);
    // for (let comment in commentsData) {
    //   movieService.addComment(comment);
    // }
  } catch (error) {
    console.error("Error seeding comments data: ", error);
  }
}
