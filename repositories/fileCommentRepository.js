const fs = require('fs');
const path = require('path');
const { readJson } = require('../utils/fileUtils');
const { log } = require('console');

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

  async countMovies() {
    const comments = await this._fetch_comments();
    return comments.length;
  }

  async checkIfAnyCommentsExist() {
    return this.countMovies > 0;
  }

  async getCommentsByMovieId(movieId, page, limit) {
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
      console.error("error seeding comments", err.stack);
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
      console.error("Error adding comment", err.stack)
    }
  }

  async deleteAllComments() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify([]))
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = FileCommentRepository;