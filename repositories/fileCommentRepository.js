const fs = require('fs');
const path = require('path');

class FileCommentRepository {

  constructor(filePath) {
    const env = process.env.NODE_ENV

    if (env == 'test') {
        this.filePath = path.join(__dirname, '../test/comments.json');
    } else {
        this.filePath = path.join(__dirname, '../prod/comments.json');
    }
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


  async getComments() {
    const data = await fs.promises.readFile(this.filePath, 'utf8');
    return JSON.parse(data);
  }

  async getCommentsByMovieId(id, page, limit) {
    const comments = await this.getComments();    
    const movieComments = comments.response.filter((comment) =>
      comment.movie_id === parseInt(id)
    );
    return this.paginateData(movieComments, page, limit);
  }

  async seedComment(movie) {
    await fs.promises.writeFile(this.filePath, JSON.stringify(movie));
  }

  async postComment(id, content, author) {
    const newComment = {
      id: 11,
      movieId: id,
      content,
      author,
    };
    const comments = await this.getComments();
    comments.response.push(newComment);
    await fs.promises.writeFile(this.filePath, JSON.stringify(comments));
    return comments.response.filter((comment) =>
      comment.id === parseInt(newComment.id)
    );
  }

  async deleteAllComments() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf8');
      const jsonData = JSON.parse(data);
      jsonData.response = [];
      await fs.promises.writeFile(this.filePath, JSON.stringify(jsonData))
    } catch (err) {
      console.error(err);
    }
  }
  

  async destroyDB() {
    await fs.promises.unlink(this.filePath);
  }
}


module.exports = FileCommentRepository;
