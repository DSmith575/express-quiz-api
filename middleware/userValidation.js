import Joi from 'joi';

const userFirstLastNameMin = 2;
const userFirstLastNameMax = 50;
const userFirstLastPattern = /^[A-Za-z]+$/;

const userNameMin = 5;
const userNameMax = 10;

const userPasswordMin = 8;
const userPasswordMax = 16;
const userPasswordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])\S+$/;

const registerFirstLastNameSchemaObj = Joi.string()
  .min(userFirstLastNameMin)
  .max(userFirstLastNameMax)
  .pattern(userFirstLastPattern);

const registerUsernameSchemaObj = Joi.string()
  .min(userNameMin)
  .max(userNameMax)
  .alphanum();


const emailSchemaObj = Joi.string().email({ tlds: { allow: true } });

const registerPasswordSchemaObj = Joi.string()
  .min(userPasswordMin)
  .max(userPasswordMax)
  .pattern(userPasswordPattern);

const registerFirstLastName = (name) => {
  return registerFirstLastNameSchemaObj.required().messages({
    'string.base': `${name} name should be a string`,
    'string.min': `${name} name should have a minimum length of ${userFirstLastNameMin}`,
    'string.max': `${name} name should have a maximum length of ${userFirstLastNameMax}`,
    'string.pattern.base': `${name} name should only contain alpha characters`,
    'string.empty': `${name} name should not be empty`,
    'any.required': `${name} name is required`,
  });
};

const registerUsername = (username) => {
  return registerUsernameSchemaObj.required().messages({
    'string.base': `${username} should be a string`,
    'string.min': `${username} should have a minimum length of ${userNameMin}`,
    'string.max': `${username} should have a maximum length of ${userNameMax}`,
    'string.alphanum': `${username} should only contain alphanumeric characters`,
    'string.empty': `${username} should not be empty`,
    'any.required': `${username} name is required`,
  });
};

const registerEmail = (email) => {
  return emailSchemaObj.required().messages({
    'string.base': `${email} should be a string`,
    'string.email': `${email} format invalid`,
    'string.empty': `${email} should not be empty`,
    'any.required': `${email} is required`,
  });
};

const registerPassword = (password) => {
  return registerPasswordSchemaObj.required().messages({
    'string.base': `${password} should be a string`,
    'string.min': `${password} should have a minimum length of ${userPasswordMin}`,
    'string.max': `${password} should have a maximum length of ${userPasswordMax}`,
    'string.pattern.base': `${password} should contain at least one numeric and one special character`,
    'string.empty': `${password} should not be empty`,
    'any.required': `${password} is required`,
  });
};

const confirmPassword = (password) => {
  return Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': `${password} does not match`,
      'any.required': `Confirm ${password} is required`,
    });
};

const validateRegister = (req, res, next) => {
  const registerSchema = Joi.object({
    firstName: registerFirstLastName('First'),
    lastName: registerFirstLastName('Last'),
    username: registerUsername('Username'),
    email: registerEmail('Email'),
    password: registerPassword('Password'),
    confirmPassword: confirmPassword('Password'),
    role: Joi.string().valid('BASIC_USER', 'SUPER_ADMIN_USER'),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  next();
};



const validateLogin = (req, res, next) => {

  next();
};

export default { validateRegister, validateLogin };
