const fs = require('fs');

class CommentRepository {
  constructor(filePath) {
    this.filePath = filePath;
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


  async addComment(id, content, author) {
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
      await fs.promises.writeFile(this.filePath, JSON.stringify({ response: [] }));
    } catch (err) {
      console.error(err);
    }
  }
  

  async destroyDB() {
    await fs.promises.unlink(this.filePath);
  }
}


module.exports = CommentRepository;
