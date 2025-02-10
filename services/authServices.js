const AuthRepositoryAdapter = require('../repositories/authRepository');

// movieService.js (business logic layer)
class AuthService {
  constructor() {
    this.authRepository = AuthRepositoryAdapter.getRepository();
  }

  async createUsers(usersData) {    
    return await this.authRepository.createUsers(usersData);
  }

  async createUser(userData) {
    return await this.authRepository.createUser(userData);
  }

  async findUser(email) {
    return await this.authRepository.findUser(email);
  }

  async signup(username, email, password) {
    return await this.authRepository.signup(username, email, password);
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