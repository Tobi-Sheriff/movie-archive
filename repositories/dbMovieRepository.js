const { Movie } = require('../models');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../models');

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

  async randomMovieId () {
    const movies = await Movie.findAll({raw: true});
    
    if (!movies) {
      throw new Error("No movie in the DB");
    }
    let maxId = movies[movies.length - 1].id;

    return Math.floor(Math.random() * maxId) + 1;
  }

  async countMovies() {
    return await Movie.count();
  }

  async checkIfAnyMoviesExist() {
    return (await this.countMovies()) > 0;
  }

  async getMovies(page, limit) {
    try {
      const offset = (page - 1) * limit;
      const { count: totalCount, rows: movies } = await Movie.findAndCountAll({
        limit,
        offset,
      });
  
      const totalPages = Math.ceil(totalCount / limit);
      return this.paginateData(movies, page, totalPages);
    } catch (err) {
      console.error('Error getting movie list:', err.stack);
    }
  }

  async getMovieById(id) {
    try {
      return await Movie.findByPk(id);
    } catch (err) {
      console.error('Error getting a movie:', err.stack);
    }
  }

  async addAllMovies(newMovies) {
    try {
      return await Movie.bulkCreate(newMovies);
    } catch (err) {
      console.error('Error seeding movies data:', err.stack);
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
      console.error("Error Searching for movie", err.message)
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
      console.error("Error getting similar movies", err.stack);
    }
  }

  async deleteAllMovies() {
    try {
      await sequelize.query('TRUNCATE TABLE "Movies" RESTART IDENTITY CASCADE');
    } catch (error) {
      console.error('Error during movie deletion:', error);
      throw error;
    }
  }
}

module.exports = DBMovieRepository;
