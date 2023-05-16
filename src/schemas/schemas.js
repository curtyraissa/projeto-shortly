import joi from "joi";

// //Jogos
// export const jogosSchema = joi.object({
//   name: joi.string().required(),
//   image: joi.string().required(),
//   stockTotal: joi.number().min(1).required(),
//   pricePerDay: joi.number().min(1).required(),
// });

// //Clientes
// export const clientesSchema = joi.object({
//   name: joi.string().required(),
//   phone: joi
//     .string()
//     .pattern(/^[0-9]{11}$/)
//     .required(),
//   cpf: joi
//     .string()
//     .pattern(/^[0-9]{11}$/)
//     .required(),
//   birthday: joi.date().required(),
// });