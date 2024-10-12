const FileMovieRepository = require('./fileMovieRepository');
const DBMovieRepository = require('./dbMovieRepository');

function getRepository() {
  const store_type = process.env.STORE_TYPE

  if (!store_type) {
    throw new Error('store type not defined');
  }
  if (store_type == 'file') {
    return new FileMovieRepository();
  } else if (store_type == 'db') {
    return new DBMovieRepository();
  } else {
    throw new Error('No defined repository for this store type')
  }
}

module.exports = { getRepository };