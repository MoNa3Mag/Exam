const jwt = require ("jsonwebtoken")
const userModel = require("../DB/Model/User")


const Roles = {
    Admin: 'Admin',
    User: 'User'
}

const auth = (accessRoles) => {
    return async (req ,res,next) => {
       try {
        const headerToken = req.headers['authorization']
        if (!headerToken || headerToken == null || headerToken == undefined || !headerToken.startsWith(`${process.env.Bearerkey}`)) {
            res.status(400).json({message : "header token error"})
        } else {
            const token = headerToken.split(' ')[1]
            if (!token || token == null || token == undefined || token.length < 1) {
                res.status(400).json({message : "in-valid token"})
            } else {
                const decoded = jwt.verify(token, process.env.emailTokenSecreat);
                if (!decoded) {
                    res.status(403).json({ message: "In-valid decoded token" })
                } else {
                  const findUser = await userModel.findById(decoded.id).select('email role')
                  if (!findUser) {
                    res.status(404).json({ message: "In-valid token account " })
                  } else {
                    if (accessRoles.includes(findUser.role)) {
                    req.user = findUser
                    next()
                } else {
                    res.status(401).json({ message: 'not auth user'})
                    }
                  }
                }

            }
        }
       } catch (error) {
        res.status(500).json({ message: "catch error", error })
        console.log(error);
       }
    }
}


module.exports= {
    auth,
    Roles
}