const { Movie } = require('../models');
const { Op, literal } = require('sequelize');
const { sequelize } = require('../models');

class DBMovieRepository {
  paginateData(data, page, limit, totalCount) {
    const totalPages = Math.ceil(totalCount / limit);

    return {
      response: data,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    };
  }

  async countMovies() {
    return await Movie.count();
  }

  async checkIfAnyMoviesExist() {
    return (await this.countMovies()) > 0;
  }

  async getMovies(page, limit) {
    const offset = (page - 1) * limit;
    const { count: totalCount, rows: movies } = await Movie.findAndCountAll({
      limit,
      offset,
      raw: true,
    });

    return this.paginateData(movies, page, limit, totalCount);
  }

  async getMovieById(id) {
    const movie = await Movie.findByPk(id, { raw: true });
    return movie;
  }

  async addMovie(movieData) {
    const createdMovie = await Movie.create(movieData);
    return createdMovie.dataValues;
  }

  async addAllMovies(newMovies) {
    return await Movie.bulkCreate(newMovies);
  }

  async searchMovies(query, page, limit) {
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: fuzzyMatches }  = await Movie.findAndCountAll({
      where: literal(`lower(title) % lower('${query}')`),
      limit,
      offset,
      raw: true,
    });

    return this.paginateData(fuzzyMatches, page, limit, totalCount);
  }

  async getSimilarMovies(id, page, limit) {
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

    return this.paginateData(similarMovies, page, limit, totalCount);
  }

  async deleteAllMovies() {
    await sequelize.query('TRUNCATE TABLE "Movies" CASCADE');
  }
}

module.exports = DBMovieRepository;
