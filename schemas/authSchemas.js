import joi from "joi";

export const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(), //README: MUDAR PARA EMAIL DEPOIS
    password: joi.string().required(),
    confirmPassword: joi.ref('password')
});

export const signInSchema = joi.object({
    email: joi.string().required(), //README: MUDAR PARA EMAIL DEPOIS
    password: joi.string().required()
});

export const urlSchema = joi.string().required();





