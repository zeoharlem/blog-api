const Joi = require('joi');
const {StatusCodes} = require('http-status-codes')

const userSchemaValidator = Joi.object({
    first_name: Joi.string()
        .max(255)
        .trim()
        .required(),
    last_name: Joi.string()
        .max(255)
        .required()
        .trim(),
    password: Joi.string()
        .min(5)
        .trim()
        .required(),
    email: Joi.string()
        .email()
        .required()
});

const postSchemaValidator = Joi.object({
    title: Joi.string()
        .max(255)
        .trim()
        .required(),
    description: Joi.string()
        .min(10)
        .trim(),
    tags: Joi.array()
        .items(Joi.string()),
    body: Joi.string()
        .required(),
    author: Joi.string(),
    state: Joi.string(),
});

async function userValidationMiddleware(req, res, next) {
    const requestPayload = req.body

    try {
        await userSchemaValidator.validateAsync(requestPayload)
        next()
    } catch (error) {
        next(
            {
                status: StatusCodes.BAD_REQUEST,
                message: error.details[0].message
            }
        )
    }
}

async function postValidationMiddleware(req, res, next) {
    const postPayLoad = req.body

    try {
        await postSchemaValidator.validateAsync(postPayLoad)
        next()
    } catch (error) {
        next(
            {
                message: error.details[0].message,
                status: StatusCodes.BAD_REQUEST
            }
        )
    }
};

module.exports = {
    userValidationMiddleware,
    postValidationMiddleware
}
