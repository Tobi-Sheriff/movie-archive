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
    const comments = await this._fetch_comments();
    return comments.length;
  }

  async checkIfAnyMoviesExist() {
    return this.countMovies > 0;
  }

  async getCommentsByMovieId(id, page, limit) {
    const comments = await this._fetch_comments();

    const movieComments = comments.filter((comment) =>
      comment.movie_id === parseInt(id)
    );
    return this.paginateData(movieComments, page, limit);
  }

  // async seedComment(comments) {
  //   await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
  // }
  async addAllComments(newComments) {
    const comments = await this._fetch_comments();
    comments.push(...newComments);
    await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
  }

  async postComment(id, content, author) {
    const comments = await this._fetch_comments();
    const newComment = {
      id: comments.length + 1,
      movieId: id,
      content,
      author,
    };
    comments.push(newComment);
    await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
    return comments.filter((comment) =>
      comment.id === parseInt(newComment.id)
    );
  }

  async deleteAllComments() {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify([]))
    } catch (err) {
      console.error(err);
    }
  }

  async destroyDB() {
    await fs.promises.unlink(this.filePath);
  }
}

module.exports = FileCommentRepository;
