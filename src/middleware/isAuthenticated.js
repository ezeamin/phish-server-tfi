import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

const secretKey = process.env.JWT_SECRET;

export const isAuthenticated = (req, res, next) => {
  const cookieToken = req.cookies.token;

  if (!cookieToken) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      data: null,
      message: 'Token not detected',
    });
    return;
  }

  try {
    const tokenInfo = jwt.verify(cookieToken, secretKey);

    req.token = tokenInfo.token;

    // valid token
    next();
  } catch (err) {
    // invalid token
    res.status(HttpStatus.UNAUTHORIZED).json({
      data: null,
      message: 'Token not valid',
    });
  }
};
