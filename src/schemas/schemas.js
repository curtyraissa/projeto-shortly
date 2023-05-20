import joi from "joi";

//cadastro
export const cadastroSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required()});

  //login
  export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()});

  //url
 export const urlSchema = joi.object({
    url: joi.string().uri().required()});

