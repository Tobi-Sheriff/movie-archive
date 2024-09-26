// movieRepository.js
const { getInstance } = require('./dataStorage');

class MovieRepository {
  constructor() {
    this.dataStorage = getInstance('./movie.json');
  }

  async initializeMovies() {
    return this.dataStorage.initializeMovies();
  }

  async getMovies() {
    return this.dataStorage.getMovies();
  }

  async addMovie(movie) {
    const movies = await this.getMovies();
    movies.response.push(movie);
    return this.dataStorage.addMovie(movies);
  }

  async clearResponseArray() {
    return this.dataStorage.clearResponseArray();
  }

  async destroyDB() {
    return this.dataStorage.destroyDB();
  }
}


module.exports = MovieRepository;