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

  async addAllComments(newComments, seededMovies) {
    try {
      const comments = await this._fetch_comments();

      let commentMaxId = comments.length > 0 ? comments[comments.length - 1].id : 0;
      let movieMaxId = seededMovies[seededMovies.length - 1].id;

      newComments.forEach(comment => {
      let randomMovieId = Math.floor(Math.random() * movieMaxId) + 1;
        commentMaxId += 1;
        comment.id = commentMaxId;
        comment.movie_id = randomMovieId;
      });
      
      comments.push(...newComments);

      await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
    } catch (err) {
      console.error("error seeding comments", err.stack);
    }
  }

  async postComment(movieId, content, author) {
    try {
      const comments = await this._fetch_comments();
      const newComment = {
        id: comments.length + 1,
        movie_id: parseInt(movieId),
        content,
        author,
        created_at: new Date()
      };

      comments.push(newComment);
      await fs.promises.writeFile(this.filePath, JSON.stringify(comments));

      return newComment;
    } catch (err) {
      console.error("Error possting comment", err.stack)
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