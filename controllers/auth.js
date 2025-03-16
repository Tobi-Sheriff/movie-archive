const jwt = require('jsonwebtoken');
const authService = require('../services/authServices');
const { sendPasswordResetEmail } = require('../utils/nodemailer');

// Signup
module.exports.signup = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const email = req.body.email.toLowerCase();
  const { password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        error: 'Invalid request.',
        message: "All fields are required."
      });
  }

  if (username.length < 5 || username.length > 15) {
    return res
      .status(400)
      .json({
        error: 'Invalid Username length.',
        message: "Username must be between 5 and 15 characters long."
      });
  }

  const result = await authService.signup(username, email, password);
  
  if (result.isExist) {
    if (result.existingUser.isEmailMatch) {
      return res
        .status(409)
        .json({
          error: 'Email is already registered.',
          message: "Please choose a different email address."
        });
    } else if (result.existingUser.isUsernameMatch) {
      return res
        .status(409)
        .json({
          error: 'Username is already taken.',
          message: "Please choose a different email address."
        });
    }
  }

  res.status(201).json({
    message: 'User Registered Successfully!',
    user: result.user
  });
};