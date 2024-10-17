const CommentRepositoryAdapter = require('../repositories/commentRepository');

class CommentService {

  constructor() {
    this.commentRepository = CommentRepositoryAdapter.getRepository();
  }

  async checkIfAnyCommentsExist() {
    return await this.commentRepository.checkIfAnyCommentsExist();
  }

  async getCommentsByMovieId(movieId, page, limit) {
    return  await this.commentRepository.getCommentsByMovieId(movieId, page, limit);    
  }

  async addAllComments(commentsData, seededMovies) {
    await this.commentRepository.addAllComments(commentsData, seededMovies);
  }

  async postComment(movieId, content, author) {
    return await this.commentRepository.postComment(movieId, content, author);
  }

  async deleteAllComments() {
    await this.commentRepository.deleteAllComments();
  }
}

module.exports = new CommentService();