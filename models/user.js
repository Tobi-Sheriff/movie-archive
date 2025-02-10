'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    /**
     * Instance method to compare the plaintext password with the hashed password.
     */
    async validatePassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users', // Define the table name explicitly
    underscored: true, // Use snake_case for database fields
    timestamps: true, // Add createdAt and updatedAt fields
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
        try {
          user.email = user.email.toLowerCase();
          user.username = user.username.toLowerCase();
          return user;
        } catch {
          console.error('Error in beforeCreate hook:', error);
          throw new Error('Failed to convert strings to lowercase');
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
        }
        try {
          user.email = user.email.toLowerCase();
          user.username = user.username.toLowerCase();
          return user;
        } catch {
          console.error('Error in beforeCreate hook:', error);
          throw new Error('Failed to convert strings to lowercase');
        }
      },
    },
  });

  return User;
};