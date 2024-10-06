const CommentRepositoryAdapter = require('../repositories/commentRepository');

class CommentService {

  constructor() {
    this.commentRepository = CommentRepositoryAdapter.getRepository();
  }

  async checkIfAnyMoviesExist() {
    return await this.movieRepository.checkIfAnyMoviesExist();
  }
  
  async getComments() {
    return await this.commentRepository.getComments();
  }

  async getCommentsByMovieId(id, page, limit) {
    return  await this.commentRepository.getCommentsByMovieId(id, page, limit);    
  }

  async addAllComments(comments) {
    return await this.commentRepository.addAllComments(comments);
  }

  async postComment(id, content, author) {
    return await this.commentRepository.postComment(id, content, author);
  }

  async deleteAllComments() {
    await this.commentRepository.deleteAllComments();
  }

  async destroyComments() {
    return this.commentRepository.destroyDB();
  }

}

module.exports = new CommentService();