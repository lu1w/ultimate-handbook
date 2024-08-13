const express = require('express');
const authController = require('../../controllers/auth.controller');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

router.post('/signin', verifyToken, authController.signIn);

module.exports = router;
