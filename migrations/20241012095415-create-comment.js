'use strict';
const { TABLE_NAMES } = require ('../utils/constants');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAMES.COMMENT, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movie_id: {
        type: Sequelize.INTEGER,
        references: {
          model: TABLE_NAMES.MOVIE, // Reference the Movies table
          key: 'id'
        },
        onDelete: 'CASCADE' // Ensures comments get deleted if the movie is deleted
      },
      author: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(TABLE_NAMES.COMMENT);
  }
};
