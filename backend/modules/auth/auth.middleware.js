const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    let token;

    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // If not in header, check cookies
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access token required'
        });
    }

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey || typeof secretKey !== 'string' || secretKey.trim() === '') {
        return res.status(500).json({
            status: 'error',
            message: 'JWT secret key is not configured or is empty'
        });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: 'error',
                message: err.message
            });
        }
        req.user = user;
        next();
    });
};

module.exports = {
    authenticateToken
};