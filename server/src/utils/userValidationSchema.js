import joi from "joi";

const userRegisterSchema = joi.object({
  username: joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
    "any.required": "Username is required",
  }),
  email: joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const loginValidationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.base": "Username should be a string.",
    // "string.min": "Username should have at least 3 characters.",
    // "string.max": "Username should have at most 30 characters.",
    "any.required": "Username is required.",
  }),
  password: joi.string().required().messages({
    "string.base": "Password should be a string.",
    // "string.min": "Password should have at least 6 characters.",
    "any.required": "Password is required.",
  }),
});

export { userRegisterSchema, loginValidationSchema };
