import nodemailer from 'nodemailer';

export const transporterAuth = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER_AUTH,
    pass: process.env.SMTP_PASS_AUTH,
  },
});
