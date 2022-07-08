const router = require ("express").Router();
const validators = require ("./user.validation");
const endPoint = require ("./user.endPoint")
const Controller = require ("./Controller/userProfile");
const { auth } = require("../../Middlewares/auth");
const { validation } = require("../../Middlewares/validators");
const { myMulter, multerValidation } = require("../../Service/multer");


//signup
router.post("/signup" , validation(validators.signup) , Controller.signup)

//confirmEmail
router.get("/confirmEmail/:token" , Controller.confirm)

//refreshEmail
router.get("/refreshToken/:id" , Controller.refreshToken)

//signin
router.post("/signin" , Controller.signin)

//updateProfile
router.patch("/updateProfile" , auth(endPoint.updateProfile) , validation(validators.updateProfile) , Controller.updateProfile)

//deleteUser
router.delete("/deleteUser" , auth(endPoint.deleteUser) , validation(validators.deleteUser) , Controller.deleteUser)

//profilePic
router.patch("/profilePic" , myMulter("user/profile/Pic" , multerValidation.image).single("image") , auth(endPoint.user) , Controller.profilePic)

//coverPic
router.patch("/coverPic" , myMulter("user/profile/covpic" , multerValidation.image).array("image" , 10) , auth(endPoint.user) , Controller.coverPic)

//forgetCode
router.post('/sendCode' , Controller.sendCode)

//forgetPassword
router.patch("/forgetPassword" , validation(validators.forgetPassword) , Controller.forgetPassword)

//softDeleted
router.patch("/softDeleted" , auth(endPoint.softDeleted) , Controller.softDeleted)

//allUsers
router.get("/" , Controller.getUsers)


module.exports = router;