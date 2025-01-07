const { User } = require('../models');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

class DBAuthRepository {

  async signup(username, email, password) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const user = await User.create({
      username,
      email,
      password_hash: password,
    });

    return user.dataValues;
  }

  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    const userData = {
      user,
      token,
      secure: process.env.NODE_ENV === 'production'
    }

    return userData;
  }

  async deleteAllUsers() {
    await User.destroy({ where: {}, truncate: true });
  }
}

module.exports = DBAuthRepository;
