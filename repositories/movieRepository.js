const FileMovieRepository = require('./fileMovieRepository');
const DBMovieRepository = require('./dbMovieRepository');

function getRepository() {
  const db_type = process.env.DB_TYPE
  if (!db_type) {
    throw new Error('DB type not defined');
  }
  if (db_type == 'file') {
    return new FileMovieRepository();
  } else if (store_type == 'db') {
    return new DBMovieRepository();
  } else {
    throw new Error('No defined repository for this store type')
  }
}

module.exports = { getRepository };