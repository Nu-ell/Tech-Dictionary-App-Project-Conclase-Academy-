const nodemailer = require('nodemailer');

const sendInvitationEmail = async (email, invitationUrl) => {
  try {
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
      to: email,
      subject: 'Admin Invitation',
      text: `You have been invited to become an admin. Click the link below to register:\n\n${invitationUrl}\n\nThis link will expire in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
};

module.exports = sendInvitationEmail;
