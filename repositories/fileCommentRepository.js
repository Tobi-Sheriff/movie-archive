const fs = require('fs');
const path = require('path');
const { readJson } = require('../utils/fileUtils');

class FileCommentRepository {
  constructor(filePath) {
    const env = process.env.NODE_ENV
    if (env == 'test') {
      this.filePath = path.join(__dirname, '../test/comments.json');
    } else {
      this.filePath = path.join(__dirname, '../prod/comments.json');
    }
  }

  async _fetch_comments() {
    return readJson(this.filePath);
  }

  async countComments() {
    const comments = await this._fetch_comments();
    return comments.length;
  }

  async checkIfAnyCommentsExist() {
    return (await this.countComments()) > 0;
  }

  async getCommentsByMovieId(movieId, page, limit) {
    const comments = await this._fetch_comments();
    const movieComments = comments.filter((comment) =>
      comment.movie_id === parseInt(movieId)
    );

    const totalCount = movieComments.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedData = movieComments.slice(startIndex, endIndex);
    return {
      response: paginatedData,
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

  async addAllComments(newComments) {
    const comments = await this._fetch_comments();
    let commentMaxId = comments.length > 0 ? comments[comments.length - 1].id : 0;

    newComments.forEach(comment => {
      commentMaxId += 1;
      comment.id = commentMaxId;
    });

    comments.push(...newComments);

    await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
  }

  async addComment(newComment) {
    const comments = await this._fetch_comments();

    const maxId = comments.length > 0 ? comments[comments.length - 1].id : 0;
    newComment.id = maxId + 1;

    comments.push(newComment);
    await fs.promises.writeFile(this.filePath, JSON.stringify(comments, null, 2));

    return newComment;
  }

  async deleteAllComments() {
    await fs.promises.writeFile(this.filePath, JSON.stringify([]))
  }
}

module.exports = FileCommentRepository;