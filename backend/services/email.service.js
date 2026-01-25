const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, token) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(email)}&token=${token}`;
    console.log('SendGrid key loaded:', !!process.env.SENDGRID_API_KEY);

    const msg = {
        to: email, // recipient
        from: process.env.FROM_EMAIL, // verified sender
        subject: 'Verify your email',
        text: `Please verify your email using this link: ${verifyUrl}\nYour verification token: ${token}`,
        html: `
            <p>Please verify your email:</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p><strong>Your verification token:</strong> ${token}</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};

module.exports = { sendEmail };
