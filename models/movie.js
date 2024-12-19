'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.hasMany(models.Comment, { foreignKey: 'movie_id' });
    }
  }

  Movie.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tmdb_movie_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    backdrops: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    genres: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    ratings: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: true,
    },
    directors: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    top_casts: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    trailers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    reviews: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    sequelize,
    modelName: 'Movie',
    timestamps: false,
  });

  return Movie;
};