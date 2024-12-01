'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tmdb_movie_id: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      poster: {
        type: Sequelize.STRING
      },
      backdrop: {
        type: Sequelize.STRING
      },
      release_date: {
        type: Sequelize.STRING
      },
      genres: {
        type: Sequelize.ARRAY(Sequelize.STRING)  // Specify that the array will hold strings
      },
      overview: {
        type: Sequelize.TEXT
      },
      likes: {
        type: Sequelize.INTEGER
      },
      ratings: {
        type: Sequelize.FLOAT
      },
      director: {
        type: Sequelize.STRING
      },
      top_cast: {
        type: Sequelize.ARRAY(Sequelize.STRING)  // Another array of strings for cast members
      },
      trailer: {
        type: Sequelize.STRING
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};
