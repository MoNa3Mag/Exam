const router = require ("express").Router();
const { auth } = require("../../Middlewares/auth");
const ControllerProduct = require ("./Controller/product");
const endPoint = require("./product.endPoint");
const validators = require ("../Product/product.validation");
const { validation } = require("../../Middlewares/validators");


//addProduct
router.post("/addProduct" , validation(validators.addProducts) , auth(endPoint.addProduct) ,  ControllerProduct.addProduct)

//updateProduct
router.patch("/updateProduct/:id" , validation(validators.updateProduct) , auth(endPoint.updateProduct) ,  ControllerProduct.updateProduct)

//deleteProduct
router.delete("/deleteProduct/:id" , validation(validators.deleteProduct) , auth(endPoint.addProduct) ,  ControllerProduct.deleteProduct)

//softDeletePro
router.patch("/softDeletePro" , validation(validators.softDeleted) , auth(endPoint.addProduct) ,  ControllerProduct.sodtDeletePro)

//likw_unlike
router.patch("/like_unlikePost/:id" , validation(validators.deleteProduct) , auth(endPoint.updateProduct) ,  ControllerProduct.like_unlikePost)

//addWishList
router.patch("/addWishList" , auth(endPoint.addProduct) ,  validation(validators.softDeleted) ,ControllerProduct.addWishList)

//HideProduct
router.patch("/HideProduct" , validation(validators.softDeleted) , ControllerProduct.HideProduct)

module.exports = router;