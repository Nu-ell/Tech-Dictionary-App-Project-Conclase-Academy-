require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendInvitationEmail(to, invitationUrl) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_FROM,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: process.env.OAUTH_ACCESS_TOKEN,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Admin Invitation',
    text: `You have been invited to become an admin. Please register using the following link: ${invitationUrl}`,
    html: `<p>You have been invited to become an admin. Please register using the following link:</p><p><a href="${invitationUrl}">${invitationUrl}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendInvitationEmail;
