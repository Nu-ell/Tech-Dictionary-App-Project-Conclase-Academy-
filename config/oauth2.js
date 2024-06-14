const { OAuth2Client } = require('google-auth-library');

// Replace with your actual credentials
const CLIENT_ID = '924937993033-oqn97p6oq010q66n5a1fg5b747mq3mek.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/oauth/callback'; // Replace with your redirect URI

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

module.exports = oauth2Client;
