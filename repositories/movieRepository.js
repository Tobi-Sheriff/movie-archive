const FileMovieRepository = require('./fileMovieRepository');

function getRepository() {
  const store_type = process.env.STORE_TYPE
  if (!store_type) {
    throw new Error('DB type not defined');
  }
  if (store_type == 'file') {
    return new FileMovieRepository();
  }
}

module.exports = { getRepository };