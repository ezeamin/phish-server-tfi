import nodemailer from 'nodemailer';
import { prisma } from '../helpers/prisma.js';

/**
 * create a function that uses nodemailer to send mails to users in a db. This mail comes from a template to be specified. users from the db are retrieved using prisma client (import {prisma} from "../helpers/prisma.js"), table "data", column "email". Create this logic inside a function, because it will then be called one to ten at a time, leaving time periods in between, to avoid being blocked from the smtp server
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateHtml = (user) => `

<main style="font-family: Arial">
  <p>Hola</p>

  <p>
    Usted solicitó un restablecimiento de contraseña para su cuenta '${user.dni}' en
    UNSTA - Plataforma SEO (Soporte Educativo Online).
    </p>
    
    <p>
    Para confirmar esta petición, y establecer una nueva contraseña para su
    cuenta, por favor vaya a la siguiente dirección de Internet: ${'hola' /* link */} (Este
    enlace es válido durante 30 minutos desde el momento en que hizo la
    solicitud por primera vez .
    </p>
    
    <p>
    Si usted no ha solicitado este restablecimiento de contraseña, no necesita
    realizar ninguna acción.
    </p>
    
    <p>
    Si necesita ayuda, por favor póngase en contacto con el administrador del
    sitio,
    </p>
    <p>
    Soporte Virtual<br />
    ljuarez@unsta.edu.ar
    </p>
    <img src="${process.env.EMAIL_IMAGE}?token=${user.id}" />
</main>
`;

async function sendEmails() {
  try {
    // Retrieve users from the database
    const users = await prisma.data.findMany({
      // where: { mailsent: false }, TODO -> Uncomment this line to send only to users that haven't received the email yet
    });
    // Loop through each user and send the email
    users.forEach(async (user) => {
      // Customize the email template here
      const mailOptions = {
        from: {
          name: 'Soporte Virtual (vía SEO)',
          address: 'seo-unsta@example.com',
        },
        to: user.email,
        subject:
          'UNSTA - Plataforma SEO (Soporte Educativo Online): Solicitud de restablecimiento de contraseña',
        html: generateHtml(user),
      };

      // Send the email
      transporter
        .sendMail(mailOptions)
        .then(async () => {
          console.log(`Email sent to ${user.email}`);
          try {
            await prisma.data.update({
              where: { id: user.id },
              data: { mailsent: true },
            });
          } catch (error) {
            console.error('Error updating mailsent:', error);
          }
        })
        .catch((error) => {
          console.error(`Error sending email to ${user.email}:`, error);
        });

      // Wait for a period of time before sending the next email
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
    });

    console.log('FINISHED - Emails sent successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

sendEmails();
