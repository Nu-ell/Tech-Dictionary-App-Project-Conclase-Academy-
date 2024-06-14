 //authController
 const Admin = require('../models/admin');
const SuperAdmin = require('../controllers/superAdminController');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const authRoutes = require('../routes/authRoutes');

// Register a new admin user

// Register a new admin user
exports.register = async (req, res) => {
    const { token, email, password } = req.body;

    try {
        // Verify the invitation token and email
        const query = 'SELECT * FROM invitations WHERE token = $1 AND email = $2 AND expires_at > NOW()';
        const result = await pool.query(query, [token, email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the admin account
        const insertQuery = 'INSERT INTO admins (email, password) VALUES ($1, $2)';
        await pool.query(insertQuery, [email, hashedPassword]);

        // Delete the invitation
        const deleteQuery = 'DELETE FROM invitations WHERE email = $1';
        await pool.query(deleteQuery, [email]);

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Error registering admin:', error.message);
        res.status(500).json({ error: 'Registration failed' });
    }
};
// Login for admin and super admin
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user is a super admin
        let query = 'SELECT * FROM superadmins WHERE email = $1';
        let result = await pool.query(query, [email]);

        if (result.rowCount === 1) {
            // User found in superAdmin table, check password
            const superAdmin = result.rows[0];
            const isMatch = await bcrypt.compare(password, superAdmin.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token for superAdmin
            const payload = {
                id: superAdmin.id,
                email: superAdmin.email,
                role: 'superAdmin'
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.json({ token });
        }

        // Check if the user is an admin
        query = 'SELECT * FROM admins WHERE email = $1';
        result = await pool.query(query, [email]);

        if (result.rowCount === 1) {
            // User found in admin table, check password
            const admin = result.rows[0];
            const isMatch = await bcrypt.compare(password, admin.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate token for admin
            const payload = {
                id: admin.id,
                email: admin.email,
                role: 'admin'
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.json({ token });
        }

        // If neither admin nor superAdmin found
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};