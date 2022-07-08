const productModel = require("../../../DB/Model/Product");
const QRCode = require('qrcode');
const { getIO } = require("../../../Service/socket");
const userModel = require("../../../DB/Model/User");


const addProduct = async(req , res)=>{
try {
    const {title , desc , price} = req.body;
    const newProduct = new productModel({title , desc , price , createdBy : req.user._id});
    const savedProduct = await newProduct.save();
    QRCode.toDataURL(`${req.protocol}://${req.headers.host}/product/addProduct${savedProduct._id}`, async function (err, url) {
        if (err) {
         res.json({ message: "Qr code errro" })
        } else {
            const Product = await productModel.findByIdAndUpdate(savedProduct._id , {$push : {QRcode : url}} , {new  : true})
            getIO().emit("BEMessage" , [Product])
            res.status(201).json({message : "Done" , Product})
        }
       })

} catch (error) {
    res.status(500).json({message:"Catch Error" , error})
    console.log(error); 
}
}


const updateProduct = async(req , res)=>{
try {
    const {id} = req.params;
    const {title , desc ,price} = req.body;
    const findProduct = await productModel.findOne({_id : id , createdBy:req.user.id})
    if (findProduct) {
        const updated = await productModel.findOneAndUpdate({_id:id} , {title , desc ,price} , {new : true})
        res.json({message:"Done" , updated})
    } else {
        res.json({message:"you are not the owner of the product"})
    }
} catch (error) {
    res.status(500).json({message:"Catch Error" , error})
    console.log(error); 
}
}

const deleteProduct = async(req , res)=>{
    try {
        const {id} = req.params;

        const user = await productModel.findOne({_id : id ,createdBy:req.user.id})
        if (user || req.user.role == 'Admin') {
          const deleted = await productModel.findByIdAndDelete(id , {new : true})  
          if(deleted){
            res.status(200).json({message : "Deleted Product" , deleted})
          }else{
            res.status(200).json({message : "This Product already deleted"})
          }
        }else{
            res.status(200).json({message : "you are not the owner of the product"}) 
        }
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error); 
    }
}

const sodtDeletePro = async(req , res)=>{
    try {
        const {id} = req.body;
        const user = await productModel.findOne({_id : id ,createdBy:req.user.id})
        if (user || req.user.role == 'Admin') {
            const deleted = await productModel.findOneAndUpdate({id : id} , {isDeleted : true} , {new : true})
            res.status(200).json({messgae : "Done" , deleted})
        } else {
            res.status(200).json({message : "you are not the owner of the product"}) 
        }

    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error); 
    }
}

const like_unlikePost = async (req, res) => {
    const { _id } = req.user
    const {id} = req.params
    const product = await productModel.findOne({_id : id})
    if (!product) {
        res.status(404).json({ message: "in-valid post id" })
    } else {
            if (product.liles.includes(_id)) {
                await productModel.findOneAndUpdate({_id : id} , { $pull : {liles : _id}})
                res.status(200).json({ message: "unLike done" })
            } else {
                await productModel.findOneAndUpdate({_id : id} , { $push : {liles : _id}})
                res.status(200).json({ message: "Like done" })  
            }
    }
}

const addWishList = async (req , res)=>{
    const {id} = req.body;
    const product = await productModel.findById(id)
    if (product.Wishlists.length > 0) {
        if (product.Wishlists.includes(req.user.id)) {
            res.status(404).json({message:"Product Exist"})
        }
    } else {
        const pushWishList = await productModel.findOneAndUpdate({_id:id} , {$push : {Wishlists : req.user.id}} , {new : true})
        res.status(200).json({message:"Done" , pushWishList})
    }
}

const HideProduct = async (req , res)=>{
    const {id} = req.body;
    const product = await productModel.findById(id)
    if (product) {
        const hide = await productModel.findOneAndUpdate(id , {Hidden : true} , {new : true})
        res.status(200).json({message:"Done" , hide})
    } else {
        res.status(404).json({message:"Not Found Product"})
    }
}




module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    sodtDeletePro,
    like_unlikePost,
    addWishList,
    HideProduct
}