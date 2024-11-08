const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

const envFileExtension = `.${process.env.NODE_ENV || 'example'}`;
dotenv.config({ path: path.join(__dirname, `../../.env${envFileExtension}`) });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(4000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url')
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  console.log('Validation Error:', error.details); // 打印详细的验证错误信息
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : '')
  }
};
