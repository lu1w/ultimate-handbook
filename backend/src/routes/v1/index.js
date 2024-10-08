const express = require('express');
const courseRoute = require('./course.route');
const searchRoute = require('./search.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/course',
    route: courseRoute
  },
  {
    path: '/search',
    route: searchRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
