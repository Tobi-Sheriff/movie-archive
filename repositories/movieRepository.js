const fs = require('fs');

class MovieRepository {
  constructor(filePath) {
    this.filePath = filePath;
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


  async getMovies(page, limit) {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      const movies = JSON.parse(data);
      return this.paginateData(movies.response, page, limit);
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
    // const movies = await this.getMovies();
    const data = await fs.promises.readFile(this.filePath, 'utf8');
    const movies = JSON.parse(data);
    const searchResult = movies.response.find((movie) => movie.id === parseInt(id));
    return searchResult;
  }


  async addMovie(movie) {
    const movies = await fs.promises.writeFile(this.filePath, JSON.stringify(movie));
    movies.response.push(movie);
    return this.dataStorage.addMovie(movies);
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
    const data = await fs.promises.readFile(this.filePath, 'utf8');
    const movies = JSON.parse(data);
    const lowercaseQuery = query.toLowerCase();

    // Exact match
    const exactMatches = movies.response.filter((movie) => movie.title.toLowerCase().includes(lowercaseQuery));

    // Fuzzy match
    const fuzzyMatches = movies.response.filter(movie => {
      const distance = levenshtein(movie.title.toLowerCase(), lowercaseQuery);
      return distance <= maxDistance;
    });

    // Combine both results (removing duplicates)
    const uniqueResults = [...new Set([...exactMatches, ...fuzzyMatches])];
    return this.paginateData(uniqueResults, page, limit);
  }


  async getSimilarMovies(id, page, limit) {
    // const movies = await this.getMovies();
    const data = await fs.promises.readFile(this.filePath, 'utf8');
    const movies = JSON.parse(data);
    const targetMovie = movies.response.find((movie) => (movie.id) === parseInt(id));
    const targetGenre = targetMovie.genres;
    const similarMovies = movies.response.filter((movie) => {
      return (movie.id) !== parseInt(id) && movie.genres.some((genre) => targetGenre.includes(genre));
    });
    return this.paginateData(similarMovies, page, limit);
  }


  async deleteAllMovies() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify({ response: [] }));
    } catch (err) {
      console.error(err);
    }
  }


  async destroyDB() {
    await fs.promises.unlink(this.filePath);
  }
}


module.exports = MovieRepository;