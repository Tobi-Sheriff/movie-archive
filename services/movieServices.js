const path = require('path');
const MovieRepository = require('../repositories/movieRepository');
const CommentRepository = require('../repositories/commentRepository');

// movieService.js (business logic layer)
class MovieService {
  constructor() {
    this.movieRepository = new MovieRepository(path.join(__dirname, '../test/movies.json'));
    this.commentRepository = new CommentRepository(path.join(__dirname, '../test/comments.json'));
  }

  async getMovies(page, limit) {
    return await this.movieRepository.getMovies(page, limit);
  }

  async getComments() {
    return await this.commentRepository.getComments();
  }


  async getMovieById(id) {
    return await this.movieRepository.getMovieById(id);
  }

  async getCommentsByMovieId(id, page, limit) {
    return  await this.commentRepository.getCommentsByMovieId(id, page, limit);    
  }


  async addMovie(movie) {
    return await this.movieRepository.addMovie(movie);
  }

  async addComment(id, content, author) {
    return await this.commentRepository.addComment(id, content, author);
  }


  async searchMovies(query, page, limit) {
    return await this.movieRepository.searchMovies(query, page, limit);
  }


  async getSimilarMovies(id, page, limit) {
    return await this.movieRepository.getSimilarMovies(id, page, limit);
  }


  async deleteAllMovies() {
    await this.movieRepository.deleteAllMovies();
  }

  async deleteAllComments() {
    return this.commentRepository.deleteAllComments();
  }


  async destroyMoviesDB() {
    return this.movieRepository.destroyDB();
  }

  async destroyCommentsDB() {
    return this.commentRepository.destroyDB();
  }
}

module.exports = MovieService;