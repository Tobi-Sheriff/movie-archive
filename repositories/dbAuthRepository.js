const { User } = require('../models');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const { Op } = require('sequelize');


class DBAuthRepository {
  async createUsers(usersData) {
    const newUsersData = usersData.map(user => {
      return {
        username: user.username.toLowerCase(),
        email: user.email.toLowerCase(),
        password_hash: user.password_hash,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    });

    return await User.bulkCreate(newUsersData);
  }

  async findUser(email) {
    const loweredcaseMail = email.toLowerCase();
    const userFound = await User.findOne({ where: { email: loweredcaseMail } });

    if (userFound) {
      return { message: "Email is already registered.", user: userFound.dataValues };
    }
  }

  async signup(username, email, password) {
    const loweredCaseMail = email.toLowerCase();
    const loweredCaseUsername = username.toLowerCase();

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email: loweredCaseMail }, { username: loweredCaseUsername }] }
    });
    if (existingUser) {
      return {
        error: true,
        existingUser: {
          isEmailMatch: existingUser.email === email,
          isUsernameMatch: existingUser.username === username
        }
      };
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
