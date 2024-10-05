const CommentRepositoryAdapter = require('../repositories/commentRepository');

class CommentService {

  constructor() {
    this.commentRepository = CommentRepositoryAdapter.getRepository();
  }

  async getComments() {
    return await this.commentRepository.getComments();
  }

  async getCommentsByMovieId(id, page, limit) {
    return  await this.commentRepository.getCommentsByMovieId(id, page, limit);    
  }

  async seedComment(comments) {
    return await this.commentRepository.seedComment(comments);
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