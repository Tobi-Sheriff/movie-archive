const { getInstance } = require('./dataStorage');

class CommentRepository {
  constructor() {
    this.dataStorage = getInstance('./comment.json');
  }

  async initializeComments() {
    // Retrieve movie from data storage
    return this.dataStorage.initializeComments();
  }

  async getComments() {
    return this.dataStorage.getComments();
  }
  async getCommentsByMovieId(id) {
    const comments = await this.dataStorage.getComments();
    return comments.response.filter((comment) =>
      comment.movie_id === parseInt(id)
    );
  }

  async addComment(comment) {
    return await this.dataStorage.addComment(comment);
  }



  async destroyDB() {
    return this.dataStorage.destroyDB();
  }
}

module.exports = CommentRepository;
