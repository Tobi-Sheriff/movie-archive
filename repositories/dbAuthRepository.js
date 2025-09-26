const { User } = require('../models');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const { Op } = require('sequelize');

class DBAuthRepository {
  async createUsers(usersData) {
    await User.bulkCreate(usersData);
  }

  async findUserByEmail(email) {
    return await User.findOne({ where: { email: email } });
  }

  async findUserByUsername(username) {
    return await User.findOne({ where: { username: username } });

  }

  async signup(newUser) {
    await User.create(newUser);
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { error: true, message: 'Invalid email or password' };
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return { error: true, message: 'Invalid email or password' };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const userData = {
      error: false,
      user,
      token,
      secure: process.env.NODE_ENV === 'production'
    }

    return userData;
  }

  async passwordReset(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  async resetPassword(decodedId) {
    const user = await User.findByPk(decodedId);
    return user;
  }

  async deleteAllUsers() {
    await User.destroy({ where: {}, truncate: true });
  }
}

module.exports = DBAuthRepository;