const commentRepository = require('../repositories/commentRepository');

class MovieService {
  async getAllComments(id) {
    return await commentRepository.getAllComments(id);
  }

  async getCommentsByMovieId(id, page, limit) {
    return await commentRepository.getCommentsByMovieId(id, page, limit);
  }

  async addComment(id, movie_id, contents, author) {
    return await commentRepository.addComment(id, movie_id, contents, author);
  }

  async deleteComment(id) {
    return await commentRepository.deleteMovie(id);
  }
}

module.exports = new MovieService();