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
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genres: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,  // Optional field
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ratings: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,  // Optional field
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    top_cast: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    trailer: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Movie',
    timestamps: false,
  });

  return Movie;
};