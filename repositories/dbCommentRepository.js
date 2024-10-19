const { Comment, Movie, sequelize, Sequelize } = require('../models');

class DBCommentRepository {
  async countComments() {
    return await Comment.count();
  }

  async checkIfAnyCommentsExist() {
    return (await this.countComments()) > 0;
  }

  async getCommentsByMovieId(movieId, page, limit) {
    try {
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
    } catch (err) {
      console.error("Error getting comments", err.stack);
      
    }
  }

  async addComment(commentData) {
    try {
      await Comment.create(commentData)
    } catch (err) {
      console.error("Error adding a Movie", err.stack);
    }
  }

  async addAllComments(newComments) {
    try {
      return await Comment.bulkCreate(newComments);
    } catch (err) {
      console.error('Error seeding comments data:', err);
    }
  }

  async postComment(movieId, content, author) {
    try {
      const newComment = {
        movie_id: movieId,
        author,
        content,
        created_at: new Date(),
      };
      const createdComment = await Comment.create(newComment);

      return createdComment.dataValues;
    } catch (err) {
      console.error("Error posting comment:", err.stack);
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
