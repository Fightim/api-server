import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'local')
    .default('development'),
  MONGODB_URI: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  AES_SECRET: Joi.string().required(),
});
