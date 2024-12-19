'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tmdb_movie_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      poster: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      backdrops: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      release_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      genres: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      overview: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      ratings: {
        type: Sequelize.DECIMAL(5, 3),
        allowNull: true,
      },
      directors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      top_casts: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      trailers: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      reviews: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    });
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  }
};
