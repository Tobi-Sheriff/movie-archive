const jwt = require('jsonwebtoken');
const authService = require('../services/authServices');

// Signup
module.exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const newUser = await authService.signup(username, email, password);

  res.status(201).json({
    message: 'User registered successfully!',
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
  });
};

// Login Route
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, token, secure } = await authService.login(email, password);

    activeTokens.add(token);

    res.cookie('token', token, {
      httpOnly: true,
      secure,
      sameSite: 'strict', // Protect against CSRF
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: 'Login successful', user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

// Logout Handler
module.exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};
