import Joi from 'joi';

class Validation {
  static userCreationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  }).messages({
    'any.required': 'O campo {{#label}} é obrigatório',
    'string.empty': 'O campo {{#label}} não pode estar vazio',
    'string.min': 'O campo {{#label}} deve ter no mínimo {#limit} caracteres',
    'string.max': 'O campo {{#label}} deve ter no máximo {#limit} caracteres',
    'string.email': 'O campo {{#label}} deve ser um endereço de email válido',
    'string.alphanum':
      'O campo {{#label}} deve conter apenas caracteres alfanuméricos',
    'string.pattern.base':
      'O campo {{#label}} deve conter apenas letras e números e ter entre 3 e 30 caracteres',
  });

  static passwordResetSchema = Joi.object({
    identifier: Joi.alternatives()
      .try(Joi.string().alphanum().min(3).max(30), Joi.string().email())
      .required()
      .messages({
        'alternatives.match':
          'O campo deve ser um nome de usuário ou um email válido',
        'any.required': 'O campo identificador é obrigatório',
        'string.empty': 'O campo identificador não pode estar vazio',
        'string.min':
          'O campo identificador deve ter no mínimo {#limit} caracteres',
        'string.max':
          'O campo identificador deve ter no máximo {#limit} caracteres',
        'string.email':
          'O campo identificador deve ser um endereço de email válido',
        'string.alphanum':
          'O campo identificador deve conter apenas caracteres alfanuméricos',
      }),
    oldPassword: Joi.string().required().messages({
      'any.required': 'O campo senha antiga é obrigatório',
      'string.empty': 'O campo senha antiga não pode estar vazio',
    }),
    newPassword: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .messages({
        'any.required': 'O campo nova senha é obrigatório',
        'string.empty': 'O campo nova senha não pode estar vazio',
        'string.pattern.base':
          'O campo nova senha deve conter apenas letras e números e ter entre 3 e 30 caracteres',
      }),
    repeatPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'A confirmação da nova senha deve ser igual à nova senha',
        'any.required': 'O campo de confirmação da nova senha é obrigatório',
      }),
  });

  static userLoginSchema = Joi.object({
    identifier: Joi.alternatives()
      .try(Joi.string().alphanum().min(3).max(30), Joi.string().email())
      .required()
      .messages({
        'alternatives.match':
          'O campo deve ser um nome de usuário ou um email válido',
        'any.required': 'O campo identificador é obrigatório',
        'string.empty': 'O campo identificador não pode estar vazio',
        'string.min':
          'O campo identificador deve ter no mínimo {#limit} caracteres',
        'string.max':
          'O campo identificador deve ter no máximo {#limit} caracteres',
        'string.email':
          'O campo identificador deve ser um endereço de email válido',
        'string.alphanum':
          'O campo identificador deve conter apenas caracteres alfanuméricos',
      }),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
      .messages({
        'any.required': 'O campo nova senha é obrigatório',
        'string.empty': 'O campo nova senha não pode estar vazio',
        'string.pattern.base':
          'O campo nova senha deve conter apenas letras e números e ter entre 3 e 30 caracteres',
      }),
  });
}

export default Validation;
