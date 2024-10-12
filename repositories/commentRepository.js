const FileCommentRepository = require('./fileCommentRepository');
const DBCommentRepository = require('./dbCommentRepository');

function getRepository() {
  const store_type = process.env.STORE_TYPE;
  
  if (!store_type) {
    throw new Error('store type not defined');
  }

  if (store_type == 'file') {
    return new FileCommentRepository();
  } else if (store_type == 'db') {
    return new DBCommentRepository();
  } else {
    throw new Error('No defined repository for this store type')
  }
}


module.exports = { getRepository };
