const MovieRepository = require('./movieRepository');
const CommentRepository = require('./commentRepository');
const { response } = require('.');

// movieService.js (business logic layer)
class MovieService {
  constructor() {
    this.movieRepository = new MovieRepository();
    this.commentRepository = new CommentRepository;
  }

  async initializeMovies() {
    return this.movieRepository.initializeMovies();
  }
  
  async initializeComments() {
    return this.commentRepository.initializeComments();
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
    const movies = await this.movieRepository.getMovies();
    return this.paginateData(movies.response, page, limit);
  }

  async getCommentsByMovieId(id, page, limit) {
    const comments = await this.commentRepository.getCommentsByMovieId(id);
    return this.paginateData(comments, page, limit);
  }

  async getComments() {
    return await this.commentRepository.getComments();
  }


  async getMovieById(id) {
    const movies = await this.movieRepository.getMovies();
    const searchResult = movies.response.find((movie) =>
      movie.id === parseInt(id));
    return searchResult;
  }

  async addMovie(movie) {
    return this.movieRepository.addMovie(movie);
  }
  async addComment(id, content, author) {
    return await this.commentRepository.addComment(id, content, author);
  }



  async searchMovies(query, page, limit) {
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
    const movies = await this.movieRepository.getMovies();
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
    const movies = await this.movieRepository.getMovies();
    const targetMovie = movies.response.find((movie) => (movie.id) === parseInt(id));
    const targetGenre = targetMovie.genres;
    const similarMovies = movies.response.filter((movie) => {
      return (movie.id) !== parseInt(id) && movie.genres.some((genre) => targetGenre.includes(genre));
    });
    const totalItems = similarMovies.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedSimilarMovies = similarMovies.slice(startIndex, endIndex);
    const pagination = {
      totalItems,
      totalPages,
      pageSize: limit,
      currentPage: page,
    };
    return {
      response: paginatedSimilarMovies,
      pagination,
    };
  }


  async clearResponseArray() {
    return this.movieRepository.clearResponseArray();
  }

  async destroyMoviesDB() {
    return this.movieRepository.destroyDB();
  }

  async destroyCommentsDB() {
    return this.commentRepository.destroyDB();
  }
}


module.exports = MovieService;