import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const transporter = nodemailer.createTransport({
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

export const mailSchema = (to, subject, text) => {
    return {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };
}
