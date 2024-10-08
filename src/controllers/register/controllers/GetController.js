import HttpStatus from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

import { prisma } from '../../../helpers/prisma.js';
import { sendNotificationMail } from '../../../scripts/notificationMail.js';

const __dirname = path.resolve();
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export class GetController {
  static async getName(req, res) {
    const { token } = req.query;

    if (!token || !token.trim || !uuidRegex.test(token)) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Token is required' });
      return;
    }

    // create token for cookie
    const jwtToken = jwt.sign({ token }, process.env.JWT_SECRET, {});

    let doesUserExist = false;
    try {
      const data = await prisma.data.findUnique({
        where: {
          id: token,
        },
        select: {
          name: true,
          formsubmitted: true,
        },
      });

      if (!data) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'Token not found' });
        return;
      }

      doesUserExist = true;

      if (data.formsubmitted) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Form already submitted' });
        return;
      }

      res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 20), // 20 minutes
      });
      res.json({ name: data.name });
    } catch (error) {
      console.log('Error getting NAME:', error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR);
      return;
    }

    try {
      const data = await prisma.data.update({
        where: {
          id: token,
          linkopened: false,
        },
        data: {
          linkopened: true,
          timeopenedlink: new Date(),
        },
      });
      console.log(`Link opened for person: ${data.email}`);
      sendNotificationMail(data, 'Link abierto');
    } catch (error) {
      if (doesUserExist) return;
      console.log('Error updating linkOpened:', error);
    }
  }

  static async getImage(req, res) {
    const { token, email = '' } = req.query;

    if (!token || !token.trim || !uuidRegex.test(token)) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Token is required' });
    }

    const imagePath = path.join(__dirname, '/public', 'logo.png');

    try {
      const image = fs.readFileSync(imagePath);
      res.writeHead(HttpStatus.OK, { 'Content-Type': 'image/png' });
      res.end(image, 'binary');
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: 'Image not found' });
    }

    const searchCondition = email
      ? {
          OR: [
            {
              id: token,
            },
            {
              email,
            },
          ],
        }
      : {
          id: token,
        };

    try {
      const data = await prisma.data.update({
        where: searchCondition,
        data: {
          mailopened: true,
          timeread: new Date(),
        },
      });
      console.log(`Mail opened for person: ${data.email}`);
      // sendNotificationMail(data, 'Mail abierto');
    } catch (error) {
      console.log(`Error updating mailopened for ${email}:`, error);
    }

    return null;
  }
}
