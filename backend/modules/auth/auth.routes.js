const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const { authenticateToken } = require('./auth.middleware');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authenticateToken, authController.login);

// Password reset
router.post('/reset-password', authController.resetPassword);

// Send email verification
router.post('/send-verification-email', authController.sendVerificationEmail);

// Email verification
router.get('/verify-email', authController.verifyEmail);


module.exports = router;