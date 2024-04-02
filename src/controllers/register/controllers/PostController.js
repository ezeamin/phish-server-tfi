import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';

export class PostController {
  static async postNewPerson(req, res) {
    const {
      body: { email, career, dni },
    } = req;

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

    res.sendStatus(HttpStatus.CREATED);
  }

  static async postFormSubmitted(req, res) {
    const { token } = req;

    try {
      const data = await prisma.data.update({
        where: {
          id: token,
        },
        data: {
          formsubmitted: true,
        },
      });
      console.log(`Form submitted for person: ${data.email}`);
    } catch (error) {
      console.log('Error updating formSubmitted:', error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    res.sendStatus(HttpStatus.OK);
  }
}
