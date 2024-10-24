const MovieRepositoryAdapter = require('../repositories/movieRepository');

// movieService.js (business logic layer)
class MovieService {

  constructor() {
    this.movieRepository = MovieRepositoryAdapter.getRepository();
  }

  async checkIfAnyMoviesExist() {
    return await this.movieRepository.checkIfAnyMoviesExist();
  }

  async getMovies(page, limit) {
    return await this.movieRepository.getMovies(page, limit);
  }

  async getMovieById(id) {
    return await this.movieRepository.getMovieById(id);
  }

  async addMovie(movie) {
    return await this.movieRepository.addMovie(movie);
  }

  async addAllMovies(movies) {
    return await this.movieRepository.addAllMovies(movies);
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
}

module.exports = new MovieService();