const { Comment, Movie, sequelize, Sequelize } = require('../models');

class DBCommentRepository {
  async countComments() {
    return await Comment.count();
  }

  async checkIfAnyCommentsExist() {
    return (await this.countComments()) > 0;
  }

  async getCommentsByMovieId(movieId, page, limit) {
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: comments } = await Comment.findAndCountAll({
      where: { movie_id: movieId },
      limit,
      offset,
      raw: true,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      response: comments,
      pagination: {
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async addAllComments(newComments, seededMovies) {
    try {
      // Fetch all movie IDs from the movies table
      const movies = await Movie.findAll({ raw: true });

      if (movies.length === 0) {
        throw new Error('No movies available to associate with comments.');
      }

      // Extract movie IDs into an array
      const movieIds = movies.map(movie => movie.id);

      let movieMaxId = seededMovies[seededMovies.length - 1].dataValues.id;

      // Assign a random movie_id to each comment
      const commentsWithMovieIds = newComments.map((comment, index) => {
        // const movieId = (movieIds[index % movieIds.length]);
        const randomMovieId = Math.floor(Math.random() * movieMaxId) + 1;

        return {
          ...comment, // Spread the existing comment details
          movie_id: randomMovieId, // Assign random movie_id
        };
      });

      return await Comment.bulkCreate(commentsWithMovieIds);
    } catch (err) {
      console.error('Error seeding comments data:', err);
    }
  }

  async postComment(movieId, content, author) {
    try {
      // const randomMovie = await Movie.findOne({
      //   order: Sequelize.literal('RANDOM()'),
      // });

      const newComment = {
        movie_id: movieId,
        author,
        content,
        created_at: new Date(),
      };
      const createdComment = await Comment.create(newComment);

      return createdComment.dataValues;
    } catch (err) {
      console.error("Error creating comment:", err.message);
    }
  }

  async deleteAllComments() {
    try {
      await Comment.destroy({ where: {}, truncate: true });
    } catch (err) {
      console.error('Error during movie deletion:', err);
      throw err;
    }
  }
}

module.exports = DBCommentRepository;
