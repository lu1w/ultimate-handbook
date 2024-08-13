const Joi = require('joi');

const signIn = {
  header: Joi.object().keys({
    'Authorization Token': Joi.string(),
  }),
};

module.exports = {
  signIn,
};
