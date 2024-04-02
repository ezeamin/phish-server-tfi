import HttpStatus from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import { prisma } from '../../../helpers/prisma.js';

const __dirname = path.resolve();
const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export class GetController {
  static async getImage(req, res) {
    const { token } = req.query;

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

    try {
      const data = await prisma.data.update({
        where: {
          id: token,
        },
        data: {
          mailopened: true,
        },
      });
      console.log(`Mail opened for person: ${data.email}`);
    } catch (error) {
      console.log('Error updating mailopened:', error);
      res.json(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return null;
  }
}
