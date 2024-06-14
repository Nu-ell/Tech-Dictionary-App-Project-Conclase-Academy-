const express = require('express');
const router = express.Router();
const oauth2Client = require('../config/oauth2');
const Token = require('../models/token');

// Route to generate authentication URL
router.get('/oauth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/gmail.readonly', // Example scope for Gmail API
    });
    res.redirect(authUrl);
  });
  
  // OAuth callback endpoint
  router.get('/oauth/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // Store tokens securely, e.g., in a database
      const tokenData = new Token({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: new Date(Date.now() + tokens.expiry_date * 1000), // Store expiry date
      });
      await tokenData.save(); // Example: Save tokens to database
  
      res.send('Authentication successful! Tokens stored securely.');
    } catch (error) {
      console.error('Error retrieving access token:', error);
      res.status(500).send('Authentication failed');
    }
  });
  
  module.exports = router;