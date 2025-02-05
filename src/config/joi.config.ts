import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
});
