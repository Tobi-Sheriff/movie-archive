const { moviesData, commentsData, usersData } = require('./seedDatas');
const movieService = require('../../services/movieServices');
const commentService = require('../../services/commentServices');
const authService = require('../../services/authServices');

module.exports.seed = async () => {
  await seedData();
}

module.exports.destroy = async () => {
  await commentService.deleteAllComments();
  await movieService.deleteAllMovies();
  await authService.deleteAllUsers();
}

async function seedData() {
  try {
    for (let i = 0; i < moviesData.length; i++) {
      const seededMovies = await movieService.addMovie(moviesData[i]);

      commentsData[i].movie_id = seededMovies.id;
    }
    await commentService.addAllComments(commentsData);
    await authService.createUsers(usersData);
  } catch (error) {
    console.error("Error seeding movies and comments data: ", error.stack);
  }
}
