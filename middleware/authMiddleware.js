//authMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/database');


// Middleware to verify token
const verifyToken = (req, res, next) => {
    // Get the token from the request headers
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    const token = authorization.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request object
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Token verification error:', error); // Log the error for debugging
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Require Admin Role' });
    }
    next();
};

// Middleware to check if the user is a superadmin
const isSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'superadmin') {
        return res.status(403).json({ error: 'Require SuperAdmin Role' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isSuperAdmin
};
