/**
 * Desc: Auth controller to handle user authentication to facilitate login
 */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService } = require('../services'); // Import services from services folder to handle user authentication

const signIn = catchAsync(async (req, res) => {
  const user = await authService.signIn(req.user);
  res.status(httpStatus.OK).send({ user });
});

module.exports = {
  signIn,
};
