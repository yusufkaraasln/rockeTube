"use strict";
// import Joi, { ObjectSchema}from "joi";
// import { Request, Response, NextFunction } from "express";
// import Logging from "../library/Logging";
// import { IAuthor } from "../models/Author";
// export const validateSchema = (schema: ObjectSchema) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//             try {
//                 await schema.validateAsync(req.body);
//                 next();
//             } catch (error) {
//                 Logging.error(error);
//                 return res.status(422).json({
//                     error
//                 });
//             }
//   };
// }
// export const Schemas = {
//     author: {
//         create: Joi.object<IAuthor>({
//             name: Joi.string().required()
//         }),
//         update: Joi.object<IAuthor>({
//             name: Joi.string().required()
//         })
//     },
//     book: {
//         create: Joi.object({
//             author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
//             title: Joi.string().required(),
//         }),
//         update:   Joi.object({
//             author: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
//             title: Joi.string().required(),
//         }),
//     }
// }
