const fs = require('fs');
const path = require('path');
const { readJson } = require('../utils/fileUtils');

class FileMovieRepository {

  constructor() {
    const env = process.env.NODE_ENV

    if (env == 'test') {
      this.filePath = path.join(__dirname, '../test/movies.json');
    } else {
      this.filePath = path.join(__dirname, '../prod/movies.json');
    }
  }

  async _fetch_movies() {
    return readJson(this.filePath);
  }

  async paginateData(data, page, limit) {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = data.slice(startIndex, endIndex);
    const pagination = {
      totalItems,
      totalPages,
      pageSize: limit,
      currentPage: page,
    };
    return {
      response: paginatedData,
      pagination,
    };
  }

  async countMovies() {
    const movies = await this._fetch_movies();
    return movies.length;
  }

  async checkIfAnyMoviesExist() {
    return await this.countMovies() > 0;
  }

  async getMovies(page, limit) {
    try {
      const movies = await this._fetch_movies();

      return this.paginateData(movies, page, limit);
    } catch (err) {
      if (err) {
        console.log(err);
        return { response: [] }; // Return an empty response array if JSON parsing fails
      } else {
        throw err;
      }
    }
  }

  async getMovieById(id) {
    const movies = await this._fetch_movies();
    const searchResult = movies.find((movie) => movie.id === parseInt(id));
    return searchResult;
  }

  async addMovie(movie) {
    const movies = await this._fetch_movies();
    await movies.push(movie);
    await fs.promises.writeFile(this.filePath, JSON.stringify(movies));
  }

  async addAllMovies(newMovies) {
    const movies = await this._fetch_movies();
    movies.push(...newMovies);
    await fs.promises.writeFile(this.filePath, JSON.stringify(movies));
  }

  async searchMovies(query, page, limit) {
    //  The levenshtein distance algorithm
    function levenshtein(a, b) {
      const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

      for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
      }

      for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,  // Deletion
            matrix[i][j - 1] + 1,  // Insertion
            matrix[i - 1][j - 1] + cost // Substitution
          );
        }
      }
      return matrix[a.length][b.length];
    }

    const maxDistance = 2;
    const movies = await this._fetch_movies();

    const lowercaseQuery = query.toLowerCase();

    // Exact match
    const exactMatches = movies.filter((movie) => movie.title.toLowerCase().includes(lowercaseQuery));

    // Fuzzy match
    const fuzzyMatches = movies.filter(movie => {
      const distance = levenshtein(movie.title.toLowerCase(), lowercaseQuery);
      return distance <= maxDistance;
    });

    // Combine both results (removing duplicates)
    const uniqueResults = [...new Set([...exactMatches, ...fuzzyMatches])];
    return this.paginateData(uniqueResults, page, limit);
  }

  async getSimilarMovies(id, page, limit) {
    // const movies = await this.getMovies();
    const movies = await this._fetch_movies();

    const targetMovie = movies.find((movie) => (movie.id) === parseInt(id));
    const targetGenre = targetMovie.genres;
    const similarMovies = movies.filter((movie) => {
      return (movie.id) !== parseInt(id) && movie.genres.some((genre) => targetGenre.includes(genre));
    });
    return this.paginateData(similarMovies, page, limit);
  }

  async deleteAllMovies() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify([]));
    } catch (err) {
      console.error(err);
    }
  }

  async destroyDB() {
    await fs.promises.unlink(this.filePath);
  }
}

module.exports = FileMovieRepository;