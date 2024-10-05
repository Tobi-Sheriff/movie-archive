const MovieRepositoryAdapter = require('../repositories/movieRepository');

// movieService.js (business logic layer)
class MovieService {

  constructor() {
    this.movieRepository = MovieRepositoryAdapter.getRepository();
  }

  async getMovies(page, limit) {
    return await this.movieRepository.getMovies(page, limit);
  }

  async getMovieById(id) {
    return await this.movieRepository.getMovieById(id);
  }

  async seedMovie(movie) {
    return await this.movieRepository.seedMovie(movie);
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

  async destroyMovies() {
    await this.movieRepository.destroyDB();
  }

}

module.exports = new MovieService();