const { google } = require('googleapis');
const pool = require('../config/database'); // Adjust according to your actual DB connection path


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://yourbackend.com/oauth/callback'
);

exports.oauthCallback = async (req, res) => {
  const { code, state } = req.query;
  const [token, email] = state.split('|');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const { data } = await oauth2.userinfo.get();
    const { email: userEmail, name } = data;

    const invitationResult = await pool.query('SELECT * FROM admin_invitations WHERE token = $1 AND email = $2', [token, email]);
    if (invitationResult.rowCount === 0) {
      return res.status(400).send('Invalid or expired token');
    }

    await pool.query('INSERT INTO admins (email, name) VALUES ($1, $2)', [userEmail, name]);
    await pool.query('DELETE FROM admin_invitations WHERE token = $1', [token]);

    res.send('Account created and admin privileges granted!');
  } catch (error) {
    res.status(500).send(error.message);
  }
};
