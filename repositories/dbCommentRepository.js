const { Comment } = require('../models');

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
        totalCount,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    };
  }

  async addComment(commentData) {
    const createdComment = await Comment.create(commentData);
    return createdComment.dataValues;
  }

  async addAllComments(newComments) {
    return await Comment.bulkCreate(newComments);
  }

  async deleteAllComments() {
    await Comment.destroy({ where: {}, truncate: true });
  }
}

module.exports = DBCommentRepository;
