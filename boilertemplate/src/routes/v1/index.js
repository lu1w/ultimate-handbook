const express = require('express');
const authRoute = require('./course.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/course',
    route: authRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
