// movieRepository.js
const { getInstance } = require('./dataStorage');

class MovieRepository {
  constructor() {
    this.dataStorage = getInstance('./movie.json');
  }

  async initializeMovies() {
    // Retrieve movie from data storage
    return this.dataStorage.initializeMovies();
  }

  async getMovies() {
    // Retrieve movie from data storage
    return this.dataStorage.getMovies();
  }

  async addMovie(movie) {
    // Add movie to data storage
    const movies = await this.getMovies();
    movies.response.push(movie);
    return this.dataStorage.addMovie(movies);
  }

  // async updateMovie(movie) {
  //   // Update movie in data storage
  //   return this.dataStorage.updateMovie(movie);
  // }

  async clearResponseArray() {
    return this.dataStorage.clearResponseArray();
  }

  // async deleteMovie() {
  //   const movies = await this.getMovies();
  //   const index = movies.findIndex((movie) => movie.movieId === movieId);
  //   if (index !== -1) {
  //     movies.splice(index, 1);
  //     await fs.promises.writeFile(filePath, JSON.stringify(movies));
  //   }
  // }

  async destroyDB() {
    return this.dataStorage.destroyDB();
  }

}


module.exports = MovieRepository;