const { Comment } = require('../models');
const ExpressError = require('../utils/error');

class DBCommentRepository {
  async countComments() {
    try {
      return await Comment.count();
    } catch (err) {
      throw new ExpressError(`Error Counting Comments ${err.message}`);
    }
  }

  async checkIfAnyCommentsExist() {
    try {
      return (await this.countComments()) > 0;
    } catch (err) {
      throw new ExpressError(`Error checking if Cmments exist: ${err.message}`, 404);
    }
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
      throw new ExpressError(`Error Getting Comments by movie ID: ${err.message}`, 404);
    }
  }

  async addComment(commentData) {
    try {
      const createdComment = await Comment.create(commentData);
      return createdComment.dataValues;
    } catch (err) {
      throw new ExpressError(`Error Adding a Comments: ${err.message}`, 404);
    }
  }

  async addAllComments(newComments) {
    try {
      return await Comment.bulkCreate(newComments);
    } catch (err) {
      throw new ExpressError(`Error Adding Multiple Comments: ${err.message}`, 404);
    }
  }

  async deleteAllComments() {
    try {
      await Comment.destroy({ where: {}, truncate: true });
    } catch (err) {
      throw new ExpressError(`Error Deleting Comments: ${err.message}`, 404);
    }
  }
}

module.exports = DBCommentRepository;
