const Joi = require ("joi")



const signup = {
    body : Joi.object().required().keys({
        firstName : Joi.string().required().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)).messages({
            'string.base':"sorry name must follow string char only",
            'string.empty':'plz fill u name',
            'any.required':'please enter u name'
        }),
        lastName : Joi.string().required().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)).messages({
            'string.base':"sorry name must follow string char only",
            'string.empty':'plz fill u name',
            'any.required':'please enter u name'
        }),
        email : Joi.string().email().required().messages({
            "string.email":"email must be a valid email"
        }),
        password : Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
            "string.pattern.base":"password fails to match the required pattern"
        }),
        cPassword : Joi.string().valid(Joi.ref('password')).required()
    })
}

const updateProfile = {
    headers : Joi.object().required().keys({
        authorization : Joi.string().required()
    }),

    body: Joi.object().required().keys({
        email: Joi.string().email().required().messages({
            "string.email":"email must be a valid email"
        }),
        newEmail : Joi.string().email().required().messages({
            "string.email":"email must be a valid email"
        }),
        oldPassword: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
            "string.pattern.base":"password fails to match the required pattern"
        }),
        newPassword: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
            "string.pattern.base":"password fails to match the required pattern"
        }),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required()
    })
}

const deleteUser = {
    headers : Joi.object().required().keys({
        authorization : Joi.string().required()
    })
}

const forgetPassword = {

    body: Joi.object().required().keys({
        email: Joi.string().email().required().messages({
            "string.email":"email must be a valid email"
        }),
        newPassword: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
            "string.pattern.base":"password fails to match the required pattern"
        }),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
        code: Joi.number().required(),
    })
}


module.exports = {
    signup,
    updateProfile,
    deleteUser,
    forgetPassword
}