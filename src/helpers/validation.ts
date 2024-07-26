import Joi from 'joi';

class Validation {
  static userCreationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        ),
      )
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
      'Sua senha deve conter: no mínimo 8 caracteres de comprimento; pelo menos uma letra maiúscula; pelo menos uma letra minúscula; pelo menos um dígito; pelo menos um caractere especial;',
  });

  static passwordResetSchema = Joi.object({
    identifier: Joi.alternatives()
      .try(Joi.string().alphanum().min(3).max(30), Joi.string().email())
      .required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        ),
      )
      .required(),
    repeatPassword: Joi.any().valid(Joi.ref('newPassword')).required(),
  }).messages({
    'alternatives.match':
      'O campo {{#label}} deve ser um nome de usuário ou um email válido',
    'any.required': 'O campo {{#label}} é obrigatório',
    'string.empty': 'O campo {{#label}} não pode estar vazio',
    'string.min': 'O campo {{#label}} deve ter no mínimo {#limit} caracteres',
    'string.max': 'O campo {{#label}} deve ter no máximo {#limit} caracteres',
    'string.email': 'O campo {{#label}} deve ser um endereço de email válido',
    'string.alphanum':
      'O campo {{#label}} deve conter apenas caracteres alfanuméricos',
    'string.pattern.base':
      'Sua senha deve conter: no mínimo 8 caracteres de comprimento; pelo menos uma letra maiúscula; pelo menos uma letra minúscula; pelo menos um dígito; pelo menos um caractere especial;',
    'any.only': 'A confirmação da nova senha deve ser igual à nova senha',
  });

  static userLoginSchema = Joi.object({
    identifier: Joi.alternatives()
      .try(Joi.string().alphanum().min(3).max(30), Joi.string().email())
      .required(),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        ),
      )
      .required(),
  }).messages({
    'alternatives.match':
      'O campo {{#label}} deve ser um nome de usuário ou um email válido',
    'any.required': 'O campo {{#label}} é obrigatório',
    'string.empty': 'O campo {{#label}} não pode estar vazio',
    'string.min': 'O campo {{#label}} deve ter no mínimo {#limit} caracteres',
    'string.max': 'O campo {{#label}} deve ter no máximo {#limit} caracteres',
    'string.email': 'O campo {{#label}} deve ser um endereço de email válido',
    'string.alphanum':
      'O campo {{#label}} deve conter apenas caracteres alfanuméricos',
    'string.pattern.base':
      'Sua senha deve conter: no mínimo 8 caracteres de comprimento; pelo menos uma letra maiúscula; pelo menos uma letra minúscula; pelo menos um dígito; pelo menos um caractere especial;',
  });

  static userUpdateSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional().allow(''),
    email: Joi.string().email().optional().allow(''),
    password: Joi.string()
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        ),
      )
      .optional()
      .allow(''),
  }).messages({
    'string.min': 'O campo {{#label}} deve ter no mínimo {#limit} caracteres',
    'string.max': 'O campo {{#label}} deve ter no máximo {#limit} caracteres',
    'string.email': 'O campo {{#label}} deve ser um endereço de email válido',
    'string.alphanum':
      'O campo {{#label}} deve conter apenas caracteres alfanuméricos',
    'string.pattern.base':
      'Sua senha deve conter: no mínimo 8 caracteres de comprimento; pelo menos uma letra maiúscula; pelo menos uma letra minúscula; pelo menos um dígito; pelo menos um caractere especial;',
  });
}

export default Validation;
