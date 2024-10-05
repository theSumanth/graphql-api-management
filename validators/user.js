const Joi = require("joi");

const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email.",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be atleast 6 characters long.",
  }),
  name: Joi.string().trim().min(3).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
  }),
});

const logInSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please provide a valid email address.",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
});

exports.validateSignIn = (data) => signInSchema.validate(data);
exports.validateLogIn = (data) => logInSchema.validate(data);
