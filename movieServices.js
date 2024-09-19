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
    // Retrieve movie from data storage
    return this.movieRepository.initializeMovies();
  }
  async initializeComments() {
    // Retrieve movie from data storage
    return this.commentRepository.initializeComments();
  }

  // {
  //   "results": [
  //     { "id": 1, "name": "Item 1" },
  //     { "id": 2, "name": "Item 2" },
  //     { "id": 3, "name": "Item 3" }
  //   ],
  //   "pagination": {
  //     "totalPages": 5,
  //     "currentPage": 1,
  //     "pageSize": 3
  //   }
  // }


  async getMovies(page, limit) {
    const movies = await this.movieRepository.getMovies();
    const totalItems = movies.response.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedMovies = movies.response.slice(startIndex, endIndex);
    const pagination = {
      totalItems,
      totalPages,
      pageSize: limit,
      currentPage: page,
    };
    return {
      response: paginatedMovies,
      pagination,
    };
  }
  async getComments() {
    return await this.commentRepository.getComments();
  }


  async getCommentsByMovieId(id, page, limit) {
    const comments = await this.commentRepository.getCommentsByMovieId(id);
    const totalItems = comments.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedComments = comments.slice(startIndex, endIndex);
    const pagination = {
      totalItems,
      totalPages,
      pageSize: limit,
      currentPage: page,
    };
    return {
      response: paginatedComments,
      pagination,
    };
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
    const comment = {
      id: Date.now(),
      movieId: id,
      content,
      author,
    };
    return await this.commentRepository.addComment(comment);
  }


  async searchMovies(q) {
    const movies = await this.movieRepository.getMovies();
    const searchResults = movies.response.filter((movie) =>
      movie.title.toLowerCase().includes(q.toLowerCase())
    );
    return searchResults;
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

  // async updateMovie(movie) {
  //   // Update movie in data storage
  //   return this.movieRepository.updateMovie(movie);
  // }

  // async getTotalMovieCount() {
  //   const movie = await this.movieRepository.getMovies();
  //   return movie.response.length;
  // }


  async clearResponseArray() {
    return this.movieRepository.clearResponseArray();
  }

  // async deleteMovie() {
  //   return this.movieRepository.deleteMovie();
  // }

  async destroyMoviesDB() {
    return this.movieRepository.destroyDB();
  }
  async destroyCommentsDB() {
    return this.commentRepository.destroyDB();
  }
  // Use repository for other data operations
}


module.exports = MovieService;