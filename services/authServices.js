const AuthRepositoryAdapter = require('../repositories/authRepository');
const uuid = require('uuid');
const uuidv4 = uuid.v4;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// movieService.js (business logic layer)
class AuthService {
  constructor() {
    this.authRepository = AuthRepositoryAdapter.getRepository();
  }

  async findUserByEmail(email) {
    return await this.authRepository.findUserByEmail(email);
  }

  async findUserByUsername(username) {
    return await this.authRepository.findUserByUsername(username);
  }

  async transformUserData(userData) {
    return {
      id: uuidv4(),
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      password_hash: await bcrypt.hash(userData.password, 10),
      created_at: new Date(),
      updated_at: new Date()
    }
  }

  async createUsers(usersData) {
    let emailExist, usernameExist;
    for (let i = 0; i < usersData.length; i++) {
      emailExist = await this.findUserByEmail(usersData[i].email);
      usernameExist = await this.findUserByUsername(usersData[i].username);
      if (emailExist || usernameExist) {
        break;
      }
    }

    if (emailExist || usernameExist) {
      return {
        isExist: true,
        existingUser: {
          isEmailMatch: emailExist,
          isUsernameMatch: usernameExist
        }
      };
    }

    let transformedUseraData = [];
    for (let i = 0; i < usersData.length; i++) {
      const result = await this.transformUserData(usersData[i]);
      transformedUseraData.push(result);
    }

    await this.authRepository.createUsers(transformedUseraData);
    return transformedUseraData;
  }

  async signup(username, email, password) {
    const emailExist = await this.findUserByEmail(email);
    const usernameExist = await this.findUserByUsername(username);

    if (emailExist || usernameExist) {
      return {
        isExist: true,
        existingUser: {
          isEmailMatch: emailExist,
          isUsernameMatch: usernameExist
        }
      };
    }

    const user = {
      username: username,
      email: email,
      password: password,
    };
    const newUser = await this.transformUserData(user);

    await this.authRepository.signup(newUser);
    return { isExist: false, user: newUser };
  }

  async login(email, password) {
    return await this.authRepository.login(email, password);
  }

  async passwordReset(email) {
    return await this.authRepository.passwordReset(email);
  }

  async resetPassword(decodedId) {
    return await this.authRepository.resetPassword(decodedId);
  }

  async deleteAllUsers() {
    await this.authRepository.deleteAllUsers();
  }
}

module.exports = new AuthService();