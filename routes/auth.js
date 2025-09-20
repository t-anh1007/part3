const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireGuest } = require('../middleware/auth');

// Show register form
router.get('/register', requireGuest, authController.showRegister);

// Show login form
router.get('/login', requireGuest, authController.showLogin);

// Show forgot password form
router.get('/forgot', requireGuest, authController.showForgotPassword);

// Register user
router.post('/register', requireGuest, authController.register);

// Login user
router.post('/login', requireGuest, authController.login);

// Logout user
router.post('/logout', authController.logout);

// Forgot password
router.post('/forgot', requireGuest, authController.forgotPassword);

module.exports = router;