import { notificationTransporter } from './transporter.js';

export const sendNotificationMail = (user, action) => {
  const mailOptions = {
    from: {
      name: 'Phishing Server',
      address: process.env.EMAIL_USER_NOT,
    },
    to: process.env.PERSONAL_EMAIL,
    subject: 'Actividad reciente',
    html: `<p>El usuario ${user.name} (${user.email}) ha realizado la siguiente acción: ${action}</p>`,
  };

  notificationTransporter
    .sendMail(mailOptions)
    .then(async () => {
      console.log(`Notification mail sent to ${process.env.PERSONAL_EMAIL}`);
    })
    .catch((error) => {
      console.error(
        `Error sending notification mail to ${process.env.PERSONAL_EMAIL}:`,
        error,
      );
    });
};
