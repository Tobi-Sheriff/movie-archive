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

  async signup(username, email, password) {
    const users = await this._fetch_users();

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      username,
      email,
      password_hash: password_hash,
      created_at: new Date(),
      updated_at: new Date()
    }

    users.push(newUser);
    await fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2));

    return newUser;
  }

  async deleteAllUsers() {
    await fs.promises.writeFile(this.filePath, JSON.stringify([]));
  }
}

module.exports = FileAuthRepository;