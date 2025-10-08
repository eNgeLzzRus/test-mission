const Joi = require('joi');

const registerSchema = Joi.object({
    fullName: Joi.string().trim().min(2).max(255).required(),
    birthday: Joi.date().iso().required(), 
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(100).required(),
});

const validateRegister = (data) => {
    return registerSchema.validate(data, { abortEarly: false });
};

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(100).required(),
});

const validateLogin = (data) => {
    return loginSchema.validate(data, { abortEarly: false });
}

module.exports = { validateRegister, validateLogin };   