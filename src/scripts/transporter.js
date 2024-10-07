import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  pool: true,
  // secure: true,
  // tls: {
  //   rejectUnauthorized: false,
  //   ciphers: 'SSLv3',
  // },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const notificationTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST_NOT,
  port: process.env.EMAIL_PORT_NOT,
  // secure: true,
  // tls: {
  //   rejectUnauthorized: false,
  //   ciphers: 'SSLv3',
  // },
  auth: {
    user: process.env.EMAIL_USER_NOT,
    pass: process.env.EMAIL_PASS_NOT,
  },
});
