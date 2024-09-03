import Joi from "joi";

class Validation {
  static userCreationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
    repeatPassword: Joi.any().valid(Joi.ref("password")).required(),
  }).messages({
    "any.required": "The {{#label}} field is required",
    "string.empty": "The {{#label}} field cannot be empty",
    "string.min": "The {{#label}} field must have at least {#limit} characters",
    "string.max": "The {{#label}} field must have at most {#limit} characters",
    "string.email": "The {{#label}} field must be a valid email address",
    "any.only": "The confirmation password must match the password",
    "string.alphanum":
      "The {{#label}} field must contain only alphanumeric characters",
    "string.pattern.base":
      "Your password must contain: at least 8 characters; at least one uppercase letter; at least one lowercase letter; at least one digit; at least one special character;",
  });

  static userLoginSchema = Joi.object({
    identifier: Joi.alternatives()
      .try(Joi.string().alphanum().min(3).max(30), Joi.string().email())
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
  }).messages({
    "alternatives.match":
      "The {{#label}} field must be a valid username or email",
    "any.required": "The {{#label}} field is required",
    "string.empty": "The {{#label}} field cannot be empty",
    "string.min": "The {{#label}} field must have at least {#limit} characters",
    "string.max": "The {{#label}} field must have at most {#limit} characters",
    "string.email": "The {{#label}} field must be a valid email address",
    "string.alphanum":
      "The {{#label}} field must contain only alphanumeric characters",
    "string.pattern.base":
      "Your password must contain: at least 8 characters; at least one uppercase letter; at least one lowercase letter; at least one digit; at least one special character;",
  });

  static userUpdateSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
  }).messages({
    "string.empty": "The {{#label}} field cannot be empty",
    "string.min": "The {{#label}} field must have at least {#limit} characters",
    "string.max": "The {{#label}} field must have at most {#limit} characters",
    "string.email": "The {{#label}} field must be a valid email address",
    "any.required": "The {{#label}} field is required",
    "string.alphanum":
      "The {{#label}} field must contain only alphanumeric characters",
    "string.pattern.base":
      "Your password must contain: at least 8 characters; at least one uppercase letter; at least one lowercase letter; at least one digit; at least one special character;",
  });

  static requestResetPassword = Joi.object({
    email: Joi.string().email().required(),
  }).messages({
    "string.empty": "The {{#label}} field cannot be empty",
    "string.email": "The {{#label}} field must be a valid email address",
    "any.required": "The {{#label}} field is required",
  });

  static resetPassword = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
    repeatPassword: Joi.any().valid(Joi.ref("newPassword")).required(),
  }).messages({
    "any.required": "The {{#label}} field is required",
    "string.empty": "The {{#label}} field cannot be empty",
    "string.min": "The {{#label}} field must have at least {#limit} characters",
    "string.max": "The {{#label}} field must have at most {#limit} characters",
    "string.pattern.base":
      "Your password must contain: at least 8 characters; at least one uppercase letter; at least one lowercase letter; at least one digit; at least one special character;",
    "any.only": "The confirmation password must match the new password",
  });

  static twoFactorVerify = Joi.object({
    verifyCode: Joi.string().required().length(6),
  }).messages({
    "any.required": "The {{#label}} field is required",
    "string.empty": "The {{#label}} field cannot be empty",
    "string.min": "The {{#label}} field must have at least {#limit} characters",
    "string.max": "The {{#label}} field must have at most {#limit} characters",
    "string.pattern.base":
      "Your password must contain: at least 8 characters; at least one uppercase letter; at least one lowercase letter; at least one digit; at least one special character;",
    "any.only": "The confirmation password must match the new password",
    "string.length":
      "The {{#label}} field must be exactly {#limit} characters long",
  });
}

export default Validation;
