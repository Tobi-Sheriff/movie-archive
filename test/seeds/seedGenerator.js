const { moviesData, commentsData, usersData } = require('./seedDatas');
const movieService = require('../../services/movieServices');
const commentService = require('../../services/commentServices');
const authService = require('../../services/authServices');

module.exports.seedMoviesAndComment = async () => {
  await seedMoviesAndCommentData();
}
module.exports.seedUsers = async () => {
  await seedUsersData();
}

module.exports.destroyMoviesAndComment = async () => {
  await commentService.deleteAllComments();
  await movieService.deleteAllMovies();
}
module.exports.destroyUsers = async () => {
  await authService.deleteAllUsers();
}

async function seedMoviesAndCommentData() {
  try {
    for (let i = 0; i < moviesData.length; i++) {
      const seededMovies = await movieService.addMovie(moviesData[i]);
      
      commentsData[i].movie_id = seededMovies.id;
    }
    await commentService.addAllComments(commentsData);
  } catch (error) {
    console.error(error.message);
    console.error("Error seeding movies and comments data: ", error.stack);
  }
}
async function seedUsersData() {
  await authService.createUsers(usersData);
}