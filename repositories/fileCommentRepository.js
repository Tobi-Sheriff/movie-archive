const fs = require('fs');
const path = require('path');
const { readJson } = require('../utils/fileUtils');
const ExpressError = require('../utils/error');

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
    try {
      return readJson(this.filePath);
    } catch (err) {
      throw new ExpressError(`Error checking if Comments exist: ${err.message}`, 404);
    }
  }

  async countComments() {
    try {
      const comments = await this._fetch_comments();
      return comments.length;
    } catch (err) {
      throw new ExpressError(`Error Counting Comments ${err.message}`);
    }
  }

  async checkIfAnyCommentsExist() {
    try {
      return (await this.countComments()) > 0;
    } catch (err) {
      throw new ExpressError(`Error checking if Movies exist: ${err.message}`, 404);
    }
  }

  async getCommentsByMovieId(movieId, page, limit) {
    try {
      const comments = await this._fetch_comments();
      const movieComments = comments.filter((comment) =>
        comment.movie_id === parseInt(movieId)
      );

      const totalItems = movieComments.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const paginatedData = movieComments.slice(startIndex, endIndex);
      return {
        response: paginatedData,
        pagination: {
          totalItems,
          totalPages,
          pageSize: limit,
          currentPage: page,
        }
      };
    } catch (err) {
      throw new ExpressError(`Error Getting Comments by movie ID: ${err.message}`, 404);
    }
  }

  async addAllComments(newComments) {
    try {
      const comments = await this._fetch_comments();
      let commentMaxId = comments.length > 0 ? comments[comments.length - 1].id : 0;

      newComments.forEach(comment => {
        commentMaxId += 1;
        comment.id = commentMaxId;
      });

      comments.push(...newComments);

      await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
    } catch (err) {
      throw new ExpressError(`Error Adding Multiple Comments: ${err.message}`, 404);
    }
  }

  async addComment(newComment) {
    try {
      const comments = await this._fetch_comments();

      const maxId = comments.length > 0 ? comments[comments.length - 1].id : 0;
      newComment.id = maxId + 1;

      comments.push(newComment);
      await fs.promises.writeFile(this.filePath, JSON.stringify(comments, null, 2));

      return newComment;
    } catch (err) {
      throw new ExpressError(`Error Adding a Comments: ${err.message}`, 404);
    }
  }

  async deleteAllComments() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify([]))
    } catch (err) {
      throw new ExpressError(`Error Deleting Comments: ${err.message}`, 404);
    }
  }
}

module.exports = FileCommentRepository;