const { getInstance } = require('./dataStorage');

class CommentRepository {
  constructor() {
    this.dataStorage = getInstance('./comment.json');
  }

  async initializeComments() {
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

  async addComment(id, content, author) {
    const newComment = {
      id: 11,
      movieId: id,
      content,
      author,
    };
    await this.dataStorage.addComment(newComment);
    const comments = await this.dataStorage.getComments();
    return comments.response.filter((comment) =>
      comment.id === parseInt(newComment.id)
    );
  }

  async destroyDB() {
    return this.dataStorage.destroyDB();
  }
}

module.exports = CommentRepository;
