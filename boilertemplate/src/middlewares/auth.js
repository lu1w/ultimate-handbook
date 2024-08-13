const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { auth } = require('../config/firebase-admin');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, error.message));
  }
};

module.exports = {
  verifyToken,
};
