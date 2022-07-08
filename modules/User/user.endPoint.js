const { Roles } = require("../../Middlewares/auth");

const endPoint = {

    user : [Roles.User],
    updateProfile : [Roles.User],
    deleteUser : [Roles.Admin , Roles.User],
    softDeleted : [Roles.Admin]
}

module.exports = endPoint