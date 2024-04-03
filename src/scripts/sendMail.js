import { prisma } from '../helpers/prisma.js';
import { transporter } from './transporter.js';

const generateHtml = (user) => `
<main style="font-family: Arial">
  <p>Hola.</p>

  <p>
    Este es un comunicado para solicitarle que reestablezca la contraseña de su cuenta '${user.dni}' en
    UNSTA - Plataforma SEO (Soporte Educativo Online). Durante el fin de semana, ocurrió un error en nuestros sistemas
    y consideramos necesario que cambie su contraseña por motivos de seguridad.
    </p>
    
    <p>
    Para establecer una nueva contraseña para su cuenta, por favor vaya a la siguiente 
    <a href="${process.env.EMAIL_LINK}?token=${user.id}">dirección de Internet</a> (si no puede
    acceder, copie y pegue el siguiente enlace en su navegador).
    <br/> ${process.env.EMAIL_LINK}?token=${user.id} 
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
  // Get "email" argument from the command line
  const emailArg = process.argv[2];
  let email = '';
  if (emailArg) {
    // eslint-disable-next-line prefer-destructuring
    email = emailArg.split('=')[1];

    // check if the email is valid
    if (!email.includes('@') || !email.includes('.')) {
      console.error('Invalid email address.');
      return;
    }

    console.log('Sending to email:', email);
  }

  try {
    // Retrieve users from the database
    const users = await prisma.data.findMany(
      email
        ? { where: { email } }
        : {
            // where: { mailsent: false }, TODO -> Uncomment this line to send only to users that haven't received the email yet
          },
    );

    console.log(`People found: ${users.length}`);

    users.forEach(async (user) => {
      // Create wait time between emails
      const waitTime = email ? 0 : Math.floor(Math.random() * 10000);
      console.log(`Wait time for this email: ${(waitTime / 1000).toFixed(1)}s`);

      // Customize the email template here
      const mailOptions = {
        from: {
          name: 'Soporte Virtual (vía SEO)',
          address: process.env.EMAIL_USER,
        },
        to: user.email,
        subject:
          'UNSTA - Plataforma SEO (Soporte Educativo Online): Solicitud de restablecimiento de contraseña',
        html: generateHtml(user),
      };

      setTimeout(() => {
        // Send the email
        transporter
          .sendMail(mailOptions)
          .then(async () => {
            console.log(`Email sent to ${user.email}`);
            try {
              await prisma.data.update({
                where: { id: user.id },
                data: { mailsent: true, timesent: new Date() },
              });
            } catch (error) {
              console.error('Error updating mailsent:', error);
            }
          })
          .catch((error) => {
            console.error(`Error sending email to ${user.email}:`, error);
          });

        console.log('Finished waiting.');
      }, waitTime);
    });
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

sendEmails();
