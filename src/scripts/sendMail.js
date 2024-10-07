import { prisma } from '../helpers/prisma.js';
import { transporter } from './transporter.js';

const generateHtml = (user) => `
<main style="font-family: Arial">
  <p>Hola ${user.name}.</p>

  <p>
    Este es un comunicado para solicitarle que reestablezca la contraseña de su cuenta en
    UNSTA - Plataforma SEO (Soporte Educativo Online). Durante el fin de semana, ocurrió un error en nuestros sistemas
    y <b>consideramos sumamente necesario que cambie su contraseña por motivos de seguridad</b>. 
    </p>

    <p>Esto no significa que no pueda ingresar a su cuenta, pero le pedimos que restablezca
     su contraseña lo antes posible. En especial si la utiliza en otros servicios.</p>
    
    <p>
    Para establecer una nueva contraseña para su cuenta, por favor vaya a la siguiente 
    <a href=${process.env.EMAIL_LINK}?token=${user.id}>dirección de Internet</a> (si no puede
    acceder, copie y pegue el siguiente enlace en su navegador).
    <br/> ${process.env.EMAIL_LINK}?token=${user.id} 
    </p>
    
    <p>
    Si necesita ayuda, por favor póngase en contacto con el administrador del
    sitio. Pedimos disculpas por cualquier inconveniente que esto pueda causar.
    </p>
    <p>
    Soporte Virtual<br />
    lgonzalez@unsta.edu.ar
    </p>
    <img src="${process.env.EMAIL_IMAGE}?token=${user.id}&email=${user.email}" />
</main>
`;

async function main() {
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
            where: { mailsent: false },
            take: 500,
          },
    );

    console.log(`People found: ${users.length}`);

    transporter.on('idle', () => {
      // send next message from the pending queue
      while (transporter.isIdle() && users.length) {
        const user = users.shift();

        const mailOptions = {
          from: {
            name: 'Soporte Virtual',
            address: process.env.EMAIL_USER,
          },
          to: user.email,
          subject:
            'UNSTA - Plataforma SEO: Solicitud de restablecimiento de contraseña',
          html: generateHtml(user),
        };

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
      }
    });
  } catch (error) {
    console.error('Error sending emails:', error);
  }
}

main();
