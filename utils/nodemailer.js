const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or another service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendPasswordResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: '"THE MOVIES ARCHIVE" <process.env.EMAIL_USER>',
    to,
    subject: 'Password Reset Request',
    text: 'Hello and how are you',
    html: `<p>You requested a password reset. Click the link below to reset your password:</p>
           <a href="${link}">Reset Password</a>`,
  });

  // console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}