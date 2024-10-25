const express = require('express');
const courseRoute = require('./course.route');
const searchRoute = require('./search.route');
const homeRoute = require('./home.route');
const databaseRoute = require('./database.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/course',
    route: courseRoute
  },
  {
    path: '/search',
    route: searchRoute
  },
  {
    path: '/home',
    route: homeRoute
  },
  {
    path: '/database',
    route: databaseRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
