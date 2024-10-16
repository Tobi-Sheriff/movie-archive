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

  async addAllComments(newComments) {
    try {
      // Fetch all movie IDs from the movies table
      const movies = await Movie.findAll({ attributes: ['id'] });

      if (movies.length === 0) {
        throw new Error('No movies available to associate with comments.');
      }

      // Extract movie IDs into an array
      const movieIds = movies.map(movie => movie.id);

      // Determine if we're running in a test environment
      const isTestEnv = process.env.NODE_ENV === 'test';

      // Assign a random movie_id to each comment
      const commentsWithMovieIds = newComments.map((comment, index) => {
        const movieId = (
          isTestEnv ?
            movieIds[index % movieIds.length] :
            movieIds[Math.floor(Math.random() * movieIds.length)]
        );
        return {
          ...comment, // Spread the existing comment details
          movie_id: movieId, // Assign random movie_id
          // created_at: new Date(), // If you want to set created_at dynamically
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
      await sequelize.query('TRUNCATE "Comments" RESTART IDENTITY CASCADE'); // Ensure sequelize is not undefined here
      // await Comment.destroy({ where: {}, truncate: true });
    } catch (err) {
      console.error('Error during movie deletion:', err);
      throw err;
    }
  }

  async destroyDB() {
    await Comment.drop();
  }
}

module.exports = DBCommentRepository;
