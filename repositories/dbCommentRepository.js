const { Comment } = require('../models');

class PgCommentRepository {
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
    return await Comment.bulkCreate(newComments);
  }

  async postComment(movieId, content, author) {
    const newComment = {
      movie_id: movieId,
      content,
      author,
    };
    return await Comment.create(newComment);
  }

  async deleteAllComments() {
    await Comment.destroy({ where: {}, truncate: true });
  }

  async destroyDB() {
    await Comment.drop();
  }
}

module.exports = PgCommentRepository;
