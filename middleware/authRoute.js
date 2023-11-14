/**
 * @description middleware token functionality
 * @file authRoute.js
 *
 * @function authRote Checks if the headers contain a token. Splits and returns the token value only
 *
 * @author Deacon Smith
 * @created 4/11/2023
 * @updated 15/11/2023
 *
 */

import jwt from 'jsonwebtoken';
import statCodes from '../utils/statusCodes/statusCode.js';

const authRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(statCodes.FORBIDDEN).json({
        statusCode: res.statusCode,
        msg: 'No token provided',
      });
    }

    const token = authHeader.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;

    return next();
  } catch (error) {
    return res.status(statCodes.FORBIDDEN).json({
      msg: 'Not authorized to access this route',
    });
  }
};

export default authRoute;
