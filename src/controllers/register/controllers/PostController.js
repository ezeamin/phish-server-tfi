import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { sendNotificationMail } from '../../../scripts/notificationMail.js';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const dniRegex = /^[0-9]{8}$/;

export class PostController {
  static async postNewPerson(req, res) {
    const {
      body: { email, career, dni },
    } = req;

    if (
      !email ||
      !career ||
      !dni ||
      !emailRegex.test(email) ||
      !dniRegex.test(dni)
    ) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    try {
      await prisma.data.create({
        data: {
          email,
          career,
          dni,
        },
      });
    } catch (error) {
      console.log('Error registering person:', error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    console.log(`New person registered: ${email} - ${career} - ${dni}`);

    // sendNotificationMail({ email, dni }, 'Registro de nuevo usuario');

    res.sendStatus(HttpStatus.CREATED);
  }

  static async postFormSubmitted(req, res) {
    const { token } = req;

    try {
      const data = await prisma.data.update({
        where: {
          id: token,
          formsubmitted: false,
        },
        data: {
          formsubmitted: true,
          timesubmitted: new Date(),
        },
      });
      console.log(`Form submitted for person: ${data.email}`);
      sendNotificationMail(data, 'Envío exitoso de formulario');
    } catch (error) {
      console.log('Error updating formSubmitted:', error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    res.sendStatus(HttpStatus.OK);
  }
}
