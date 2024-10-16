// dbUtils.js
const { Movie, Comment } = require('../models'); // Adjust the path according to your structure

async function checkIfDataExists() {
  const movieCount = await Movie.count();
  const commentCount = await Comment.count();
  
  return movieCount > 0 || commentCount > 0; // Return true if either table has data
}

module.exports = { checkIfDataExists };
