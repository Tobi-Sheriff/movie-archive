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
      title: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      genres: {
        type: Sequelize.ARRAY(Sequelize.STRING)  // Specify that the array will hold strings
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
      overview: {
        type: Sequelize.TEXT
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
