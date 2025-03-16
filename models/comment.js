'use strict';
const { Model } = require('sequelize');
const { TABLE_NAMES } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.Movie, { foreignKey: 'movie_id' });
    }
  }

  Comment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TABLE_NAMES.MOVIE,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: TABLE_NAMES.COMMENT,
    underscored: true,
    timestamps: false,
  });

  return Comment;
};