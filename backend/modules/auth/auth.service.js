const emailJsService = require('emailjs');

// Configure your email server settings
const server = emailJsService.server.connect({
  user: '<your_email>',
  password: '<your_password>',
  host: 'smtp.gmail.com',
  port: 587,
  ssl: true
});


const emailService = {
  sendVerificationEmail: async (email, token) => {
    // Simulate sending email
    console.log(`Sending verification email to ${email} with token: ${token}`);
    return Promise.resolve();
  }
};

module.exports = emailService;