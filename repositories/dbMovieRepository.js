const { Movie } = require('../models');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../models');
const ExpressError = require('../utils/error');

class DBMovieRepository {
  paginateData(data, page, totalPages) {
    return {
      response: data,
      pagination: {
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async countMovies() {
    try {
      return await Movie.count();
    } catch (err) {
      throw new ExpressError(`Error Counting Movies ${err.message}`);
    }
  }

  async checkIfAnyMoviesExist() {
    try {
      return (await this.countMovies()) > 0;
    } catch (err) {
      throw new ExpressError(`Error checking if Movies exist: ${err.message}`, 404);
    }
  }

  async getMovies(page, limit) {
    try {
      const offset = (page - 1) * limit;
      const { count: totalCount, rows: movies } = await Movie.findAndCountAll({
        limit,
        offset,
        raw: true,
      });

      const totalPages = Math.ceil(totalCount / limit);
      return this.paginateData(movies, page, totalPages);
    } catch (err) {
      throw new ExpressError(`Error getting movies List: ${err.message}`, 404);
    }
  }

  async getMovieById(id) {
    try {
      const movie = await Movie.findByPk(id, { raw: true });
      return movie;
    } catch (err) {
      throw new ExpressError(`Error getting a movie: ${err.message}`, 404);
    }
  }

  async addMovie(movieData) {
    try {
      const createdMovie = await Movie.create(movieData);

      return createdMovie.dataValues;
    } catch (err) {
      throw new ExpressError(`Error adding a movie: ${err.message}`, 404);
    }
  }

  async addAllMovies(newMovies) {
    try {
      return await Movie.bulkCreate(newMovies);
    } catch (err) {
      throw new ExpressError(`Error Multiple Movies: ${err.message}`, 404);
    }
  }

  async searchMovies(query, page, limit) {
    try {
      const offset = (page - 1) * limit;

      const fuzzyMatches = await Movie.findAll({
        where: literal(`levenshtein(lower(title), '${query.toLowerCase()}') <= 2`),
        limit,
        offset,
        raw: true,
      });

      const totalPages = Math.ceil(fuzzyMatches.length / limit);
      return this.paginateData(fuzzyMatches, page, totalPages)
    } catch (err) {
      throw new ExpressError(`Error Searching for movie: ${err.message}`, 404);
    }
  }

  async getSimilarMovies(id, page, limit) {
    try {
      const targetMovie = await this.getMovieById(id);
      if (!targetMovie) return { response: [], pagination: {} };
      const { genres } = targetMovie;
      const offset = (page - 1) * limit;

      const { count: totalCount, rows: similarMovies } = await Movie.findAndCountAll({
        where: {
          genres: {
            [Op.overlap]: genres,
          },
          id: {
            [Op.ne]: id,
          },
        },
        limit,
        offset,
      });

      const totalPages = Math.ceil(totalCount / limit);
      return this.paginateData(similarMovies, page, totalPages)
    } catch (err) {
      throw new ExpressError(`Error getting similar movies: ${err.message}`, 404);
    }
  }

  async deleteAllMovies() {
    try {
      await sequelize.query('TRUNCATE TABLE "Movies" CASCADE');
    } catch (err) {
      throw new ExpressError(`Error during movie deletion: ${err.message}`, 404);
    }
  }
}

module.exports = DBMovieRepository;
