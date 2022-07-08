const Joi = require ("joi")


const addProducts = {
    body : Joi.object().required().keys
    ({
        title : Joi.string().min(1).max(100000).required().messages({
            'string.base':"sorry title must follow string char only",
            'string.empty':'plz fill u title',
            'any.required':'please enter u title'
        }),
        desc: Joi.string().min(1).max(50000).required().messages({
            'string.base': "sorry Description must follow string char only",
            'string.empty': 'plz fill u Description',
            'any.required': 'please enter u Description'
        }),
        price : Joi.string().required().messages({'any.required': 'please enter u Description'})
    })
}

const updateProduct = {
    body : Joi.object().required().keys
    ({
        title : Joi.string().min(1).max(100000).required().messages({
            'string.base':"sorry title must follow string char only",
            'string.empty':'plz fill u title',
            'any.required':'please enter u title'
        }),
        desc: Joi.string().min(1).max(50000).required().messages({
            'string.base': "sorry Description must follow string char only",
            'string.empty': 'plz fill u Description',
            'any.required': 'please enter u Description'
        }),
        price : Joi.string().required().messages({'any.required': 'please enter u Description'})
    }),
    params : Joi.object().required().keys({
        id : Joi.string().min(24).max(24).required()
    })
}

const deleteProduct = {
    params : Joi.object().required().keys({
        id : Joi.string().min(24).max(24).required()
    }) 
}

const softDeleted = {
    body : Joi.object().required().keys
    ({
        id: Joi.string().min(24).max(24)
    })
}


module.exports = {
    addProducts,
    updateProduct,
    deleteProduct,
    softDeleted
}