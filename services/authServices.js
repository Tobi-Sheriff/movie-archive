const AuthRepositoryAdapter = require('../repositories/authRepository');

// movieService.js (business logic layer)
class AuthService {

  constructor() {
    this.authRepository = AuthRepositoryAdapter.getRepository();
  }

  async signup(username, email, password) {
    return await this.authRepository.signup(username, email, password);
  }

  async login(email, password) {
    return await this.authRepository.login(email, password);
  }

  async deleteAllUsers() {
    await this.authRepository.deleteAllUsers();
  }
}

module.exports = new AuthService();