const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

const mailSchema = (to, subject, text) => {
    return {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };
}

module.exports = { transporter, mailSchema };
