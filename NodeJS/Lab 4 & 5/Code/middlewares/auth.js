const process = require('node:process');
const jwt = require('jsonwebtoken');
const CustomError = require('../helpers/CustomError');
const { Users } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in .env');
}

async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new CustomError({ statusCode: 401, code: 'AUTH_ERROR', message: 'Missing authorization token' });
  }

  const token = authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : authorization;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await Users.findById(payload.userId).exec();

    if (!user) {
      throw new CustomError({ statusCode: 401, code: 'AUTH_ERROR', message: 'Invalid token' });
    }

    req.user = user;
    next();
  }
  catch {
    throw new CustomError({ statusCode: 401, code: 'AUTH_ERROR', message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
