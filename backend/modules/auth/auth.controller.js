const bcrypt = require('bcrypt');
const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../services/email.service');
const EmailVerification = require('../emailVerification/emailVerification.model');


const register = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password || !req.body.name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name, email and password are required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid email format'
            });
        }

        if (req.body.password.length < 8) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 8 characters long'
            });
        }

        const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

        if (!passwordStrengthRegex.test(req.body.password)) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must contain at least one letter and one number'
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: 'patient',
            phone: req.body.phone
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_NV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email: req.body.email }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const resetPassword = (req, res) => {
    // Password reset logic here
    res.json({
        status: 'success',
        message: 'Password reset link sent'
    });
}

const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and OTP are required'
            });
        }

        // Find the OTP record
        const record = await EmailVerification.findOne({ email, token: otp });
        if (!record) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid OTP'
            });
        }

        if (record.expiresAt < Date.now()) {
            return res.status(400).json({
                status: 'error',
                message: 'OTP has expired'
            });
        }
        const verifiedEmail = record.email;

        // Remove token (one-time use)
        await EmailVerification.deleteOne({ _id: record._id });

        return res.json({
            status: 'success',
            message: 'Email verified successfully',
            email: verifiedEmail
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        await EmailVerification.create({
            email,
            token: otp,
            expiresAt
        });

        await sendEmail(email, otp);

        res.json({
            status: 'success',
            message: 'Verification OTP sent'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    resetPassword,
    verifyEmail,
    sendVerificationEmail
};