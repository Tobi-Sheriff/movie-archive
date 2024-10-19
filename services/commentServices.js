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

  async addComment(commentData) {
    return await this.commentRepository.addComment(commentData);
  }

  async addAllComments(commentsData) {
    await this.commentRepository.addAllComments(commentsData);
  }

  async deleteAllComments() {
    await this.commentRepository.deleteAllComments();
  }
}

module.exports = new CommentService();