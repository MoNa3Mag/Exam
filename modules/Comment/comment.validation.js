const Joi = require ("joi")

const addComment = {
    body : Joi.object().required().keys
    ({
        commentBody: Joi.string().min(1).max(50000).required().messages({
            'string.base': "sorry commentBody must follow string char only",
            'string.empty': 'plz fill u commentBody',
            'any.required': 'please enter u commentBody'
        })
    }),
    params : Joi.object().required().keys({
        id : Joi.string().min(24).max(24).required()
    })
}

const replayComment = {
    body : Joi.object().required().keys({
        commentBody : Joi.string().optional(),
    }),
    params : Joi.object().required().keys({
        commentID : Joi.string().min(24).max(24).required()
    })
}

const deleteComment = {
    body : Joi.object().required().keys
    ({
        _id : Joi.string().min(24).max(24).required()
    }),
    params : Joi.object().required().keys({
        id : Joi.string().min(24).max(24).required()
    })
}

const like_unlikePost = {
    params : Joi.object().required().keys({
        id : Joi.string().min(24).max(24).required()
    }) 
}

module.exports = {
    addComment,
    replayComment,
    deleteComment,
    like_unlikePost
}