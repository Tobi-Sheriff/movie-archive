const express = require('express');
const authController = require('../controllers/auth');
const { protect } = require('../middleware');

const router = express.Router();

router.post('/signup', authController.signup);

// router.post('/login', authController.login);

// router.get('/protected', protect, (req, res) => {
//   res.json({ message: 'Welcome to the protected route!', user: req.user });
// });

// router.post('/password-reset', authController.passwordReset);

// router.get('/reset-password', (req, res) => {
//   res.json({ message: "Welcome to the reset page" });
// });
// router.post('/reset-password', authController.resetPassword);

// router.post('/logout', authController.logout);

module.exports = router;