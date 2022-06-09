import { signInSchema, signUpSchema } from "../schemas/authSchemas.js";

export function validateSignUp (req, res, next) {
    const {error} = signUpSchema.validate(req.body);
    if(error) return res.status(422).send(error.details); 
    next();
}

export function validateSignIn (req, res, next) {
    const {error} = signInSchema.validate(req.body);
    if(error) return res.status(422).send(error.details); 
    next();
}