const {Roles} = require("../../Middlewares/auth")

const endPoint = {
    addComment : [Roles.Admin , Roles.User],
    updateed : [Roles.User]
}

module.exports = endPoint