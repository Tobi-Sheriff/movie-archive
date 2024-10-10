const FileMovieRepository = require('./fileMovieRepository');

function getRepository() {
  const db_type = process.env.DB_TYPE
  if (!db_type) {
    throw new Error('DB type not defined');
  }
  if (db_type == 'file') {
    return new FileMovieRepository();
  }
}

module.exports = { getRepository };