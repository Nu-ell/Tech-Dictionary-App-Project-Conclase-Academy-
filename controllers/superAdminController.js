require('dotenv').config();
const { sendInvitationEmail } = require('../utils/sendInvitationEmail'); // Ensure this points to your email module
const crypto = require('crypto');
const pool = require('../config/database'); // Import the pool from db.js
const nodemailer = require('nodemailer');
const SuperAdmin = require('../models/superAdmin');
const Admin = require('../models/admin');
const Word = require('../models/word');
const Request = require('../models/UserRequest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Log in to the SuperAdmin dashboard
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login successful:', email, password); // Debugging
    const result = await pool.query('SELECT * FROM superadmins WHERE email = $1', [email]);
    const superAdmin = result.rows[0];
    if (!superAdmin) {
      console.log('Invalid credentials: No such superAdmin'); // Debugging
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      console.log('Invalid credentials: Password does not match'); // Debugging
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: superAdmin.id, email: superAdmin.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error); // Detailed error logging
    res.status(500).json({ message: 'Server error' });
  }
};
//view superAdmin dashboard
exports.getDashboard = async (req, res) => {
  try {
      const adminCountResult = await pool.query('SELECT COUNT(*) FROM admins');
      const wordCountResult = await pool.query('SELECT COUNT(*) FROM words');
      const requestCountResult = await pool.query('SELECT COUNT(*) FROM requests');

      const adminCount = parseInt(adminCountResult.rows[0].count, 10);
      const wordCount = parseInt(wordCountResult.rows[0].count, 10);
      const requestCount = parseInt(requestCountResult.rows[0].count, 10);

      const dashboardData = {
          adminCount,
          wordCount,
          requestCount
      };

      res.status(200).json(dashboardData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
// Get all admins
exports.getAdmins = async (req, res) => {
  try {
      const client = await pool.connect();

      // Query to get all admins
      const queryText = 'SELECT * FROM admins';

      const result = await client.query(queryText);
      const admins = result.rows;

      // Release the client back to the pool
      client.release();

      res.json(admins);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
// Delete an admin by ID
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
      const client = await pool.connect();

      // Query to delete an admin by ID
      const queryText = 'DELETE FROM admins WHERE id = $1';
      const values = [id];

      await client.query(queryText, values);

      // Release the client back to the pool
      client.release();

      res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
exports.inviteAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    const existingAdmin = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ error: 'Admin with this email already exists.' });
    }

    const existingInvitation = await pool.query('SELECT * FROM admin_invitations WHERE email = $1', [email]);
    if (existingInvitation.rows.length > 0) {
      return res.status(400).json({ error: 'Invitation for this email already exists.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000; // 1 hour from now

    await pool.query('INSERT INTO admin_invitations (email, token, expiration) VALUES ($1, $2, $3)', [email, token, expiration]);

    const invitationUrl = `${process.env.FRONTEND_URL}/register?token=${token}`;
    await sendInvitationEmail(email, invitationUrl);

    res.status(200).json({ message: 'Invitation sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyInvitationToken = async (req, res) => {
  const { token } = req.query;

  try {
    const result = await pool.query('SELECT email FROM admin_invitations WHERE token = $1 AND expiration > NOW()', [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    res.status(200).json({ email: result.rows[0].email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  const { email, password, token } = req.body;

  try {
    // Verify token
    const result = await pool.query('SELECT email FROM admin_invitations WHERE token = $1 AND expiration > NOW()', [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const adminResult = await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id', [email, hashedPassword]);

    // Delete used token
    await pool.query('DELETE FROM admin_invitations WHERE token = $1', [token]);

    res.status(201).json({ message: 'Admin registered successfully', adminId: adminResult.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View and manage analytics

exports.getAnalytics = async (req, res) => {
  try {
    const wordAnalyticsQuery = {
      text: `SELECT class, COUNT(*) as count
             FROM words
             GROUP BY class
             ORDER BY count DESC`,
    };

    const requestAnalyticsQuery = {
      text: `SELECT status, COUNT(*) as count
             FROM requests
             GROUP BY status`,
    };

    const wordAnalyticsResult = await pool.query(wordAnalyticsQuery);
    const requestAnalyticsResult = await pool.query(requestAnalyticsQuery);

    const analyticsData = {
      wordAnalytics: wordAnalyticsResult.rows,
      requestAnalytics: requestAnalyticsResult.rows,
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View and manage all words
exports.getWords = async (req, res) => {
  try {
    const words = await Word.findAll();
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View and manage all user requests
exports.getRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View their own account information
exports.getAccountInfo = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM superadmins');
     res.json(result.rows);
    } catch {
      res.status(404).json({ error: 'SuperAdmin not found' });
    }
  };


