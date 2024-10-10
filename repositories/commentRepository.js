const FileCommentRepository = require('./fileCommentRepository');

function getRepository() {
  const db_type = process.env.DB_TYPE
  if (!db_type) {
    throw new Error('DB type not defined');
  }
  if (db_type == 'file') {
    return new FileCommentRepository();
  }
}


module.exports = {getRepository};
