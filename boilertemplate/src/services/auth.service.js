/* eslint-disable camelcase */
const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { auth } = require('../config/firebase-admin');

const signIn = async (reqUser) => {
  try {
    const { email, user_id } = reqUser;
    if (!email.endsWith('@student.unimelb.edu.au')) {
      // Verify that this is a valid email from google first, and then verify that it is an unimelb student here. //q Why not verify it is an unimelb student directly from google? //a Because google does not verify whether it is a student of unimelb, only whether it is a valid email
      // return res.status(httpStatus.UNAUTHORIZED).send({ message:  });
      auth.deleteUser(user_id);
      throw new Error('Only UniMelb students can register');
    }
    // Check if the user exists in your database
    let user = await userService.getUserByEmail(email);
    if (!user) {
      // If user doesn't exist, you can create a new user or throw an error
      const { name } = reqUser;
      const { picture } = reqUser;
      user = await userService.createUser({ name, picture, email });
    }

    // Return user data
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

module.exports = {
  signIn,
};
