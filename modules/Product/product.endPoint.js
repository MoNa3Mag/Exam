const { Roles } = require("../../Middlewares/auth");

const endPoint = {
    addProduct : [Roles.Admin , Roles.User],
    updateProduct : [Roles.User]
}

module.exports = endPoint