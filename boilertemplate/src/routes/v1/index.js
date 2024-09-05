const express = require('express');
const authRoute = require('./course.route');
const searchRoute = require('./search.route');
const { path } = require('../../app');

const router = express.Router();

const defaultRoutes = [
  
  {
    path: '/course',
    route: authRoute,
  },
  {
    path: '/search',
    route: searchRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
