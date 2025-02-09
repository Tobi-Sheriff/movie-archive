const fs = require('fs');
const path = require('path');
const { readJson } = require('../utils/fileUtils');
const uuid = require('uuid');
const uuidv4 = uuid.v4;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

class FileAuthRepository {
  constructor() {
    const env = process.env.NODE_ENV
    if (env == 'test') {
      this.filePath = path.join(__dirname, '../test/users.json');
    } else {
      this.filePath = path.join(__dirname, '../prod/users.json');
    }
  }

  async _fetch_users() {
    return readJson(this.filePath);
  }

  async findUser(email) {
    const users = await this._fetch_users();
    const userFound = users.find((user) => user.email === email);
    if (userFound) {
      return { error: true, message: "Email is already registered." }
    }
  }

  async createUsers(usersData) {
    const users = await this._fetch_users();
    let maxId = users.length > 0 ? users[users.length - 1].id : 0;

    usersData.forEach(user => {
      user.username = user.username.toLowerCase();
      user.email = user.email.toLowerCase();
      maxId += 1;
      user.id = maxId;
    });

    users.push(...usersData);

    await fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2));
    return usersData
  }

  async createUser(userData) {
    this.findUser(userData.email);
    await fs.promises.writeFile(this.filePath, JSON.stringify(userData, null, 2));
  }

  async signup(username, email, password) {
    const users = await this._fetch_users();

    const userFound = users.find((user) => user.email === email || user.username === username);
    if (userFound) {
      return {
        error: true,
        existingUser: {
          isEmailMatch: userFound.email === email,
          isUsernameMatch: userFound.username === username
        }
      };
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password_hash: password_hash,
      created_at: new Date(),
      updated_at: new Date()
    }

    users.push(newUser);
    await fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2));
    return { error: false, user: newUser };
  }

  async deleteAllUsers() {
    await fs.promises.writeFile(this.filePath, JSON.stringify([]));
  }
}

module.exports = FileAuthRepository;