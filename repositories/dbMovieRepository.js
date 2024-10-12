const { Movie } = require('../models');

class DBMovieRepository {
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
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      response: movies,
      pagination: {
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getMovieById(id) {
    return await Movie.findByPk(id);
  }

  async addMovie(movieData) {
    return await Movie.create(movieData);
  }

  async addAllMovies(newMovies) {
    return await Movie.bulkCreate(newMovies);
  }

  async searchMovies(query, page, limit) {
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: movies } = await Movie.findAndCountAll({
      where: {
        title: {
          [Op.iLike]: `%${query}%`,
        },
      },
      limit,
      offset,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      response: movies,
      pagination: {
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
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

    const totalPages = Math.ceil(totalCount / limit);

    return {
      response: similarMovies,
      pagination: {
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async deleteAllMovies() {
    await Movie.destroy({ where: {}, truncate: true });
  }

  async destroyDB() {
    await Movie.drop();
  }
}

module.exports = DBMovieRepository;
