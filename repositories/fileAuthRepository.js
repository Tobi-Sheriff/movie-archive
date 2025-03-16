const fs = require('fs');
const path = require('path');
const { readJson } = require('../utils/fileUtils');

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

  async findUserByEmail(email) {
    const users = await this._fetch_users();
    return users.find((user) => user.email === email);
  }

  async findUserByUsername(username) {
    const users = await this._fetch_users();
    return users.find((user) => user.username === username);
  }

  async createUsers(usersData) {
    const users = await this._fetch_users();
    users.push(...usersData);
    await fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2));
  }

  async signup(newUser) {
    const users = await this._fetch_users();
    users.push(newUser);
    await fs.promises.writeFile(this.filePath, JSON.stringify(users, null, 2));
  }

  async deleteAllUsers() {
    await fs.promises.writeFile(this.filePath, JSON.stringify([]));
  }
}

module.exports = FileAuthRepository;