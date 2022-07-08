const router = require ("express").Router()
const validators = require  ("./comment.validation")
const endPoint = require ("./comment.endPoint")
const ControllerComments = require ("./Controller/comment")
const { validation } = require("../../Middlewares/validators")
const { auth } = require("../../Middlewares/auth")

//addComment
router.post("/addComment/:id" , validation(validators.addComment) , auth(endPoint.addComment) , ControllerComments.addComment)

//replyComment
router.patch("/reply/:commentID" , validation(validators.replayComment) , auth(endPoint.addComment) , ControllerComments.replyComment)

//updateProduct
router.patch("/updateComment/:id" , validation(validators.addComment) , auth(endPoint.updateed) , ControllerComments.updateComment)

//deletedComment
router.delete("/deleteComment/:id" , validation(validators.deleteComment) , auth(endPoint.updateed) , ControllerComments.deleteComment)

//likw_unlike
router.patch("/like_unlikeComment/:id" , validation(validators.like_unlikePost) , auth(endPoint.addComment) ,  ControllerComments.like_unlikeComment)





module.exports = router