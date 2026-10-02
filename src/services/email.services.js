const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendVerificationEmail = async (email, token) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html:
            `<h2>Welcome to EventHorizon</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href="http://localhost:4555/api/auth/verify-email?token=${token}">
             Verify Email
            </a>
            `
    });
};

module.exports = { sendVerificationEmail };