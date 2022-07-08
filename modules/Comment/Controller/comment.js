const commentModel = require("../../../DB/Model/Comment");
const productModel = require("../../../DB/Model/Product");
const { getIO } = require("../../../Service/socket");



const addComment = async(req , res) =>{

    const {id} = req.params;
    const {commentBody} = req.body;
    const product = await productModel.findById(id)
    if (!product) {
        res.status(404).json({message:"not found product"})
    } else {
        const newComment = new commentModel({commentBody , createdBy : req.user._id , ProductId : product.id});
        const saveComment = await newComment.save();
        const Comment = await productModel.findOneAndUpdate({_id : id} , {$push : {Comments : saveComment._id}} , {new : true})
        getIO().emit("BEMessages" , [saveComment])
        res.status(201).json({message : "Done" , saveComment})
    }
}

const updateComment = async (req , res)=>{
    const {id} = req.params;
    const {commentBody} = req.body;
    const findComment = await commentModel.findOne({_id : id , createdBy:req.user.id})
    if (findComment) {
        const updated = await commentModel.findOneAndUpdate({_id:id} , {commentBody} , {new : true})
        res.json({message:"Done" , updated})
    } else {
        res.json({message:"you are not the owner of the product"})
    }

}

const deleteComment = async (req , res)=>{
    const {id} = req.params;
    const {_id} = req.body;
    const product = await productModel.findOne({createdBy : id})
    const findComment = await commentModel.findOne({id : _id , createdBy:req.user.id})
    if (product|| findComment) {
        const deledted = await commentModel.findByIdAndDelete(_id)
        res.json({message:"Done" , deledted})
    } else {
        res.json({message:"you are not the owner of the product"})
    }

}

const like_unlikeComment = async (req, res) => {
    const { _id } = req.user
    const {id} = req.params
    const comment = await commentModel.findOne({_id : id})
    if (!comment) {
        res.status(404).json({ message: "in-valid comment id" })
    } else {
            if (comment.liles.includes(_id)) {
                await commentModel.findOneAndUpdate({_id : id} , { $pull : {liles : _id}})
                res.status(200).json({ message: "unLike done" })
            } else {
                await commentModel.findOneAndUpdate({_id : id} , { $push : {liles : _id}})
                res.status(200).json({ message: "Like done" })  
            }
    }
}

const replyComment = async (req , res)=>{
    const {commentBody} = req.body;
    const {commentID} = req.params;
    const comment = await commentModel.findOne({_id : commentID})
    if (!comment) {
        res.status(404).json({message:"not found comment"})
    } else {
        const newReply = await commentModel({createdBy : req.user.id , commentID , commentBody})
        console.log(newReply.Reply);
        const saveReply = await newReply.save()
        await commentModel.findOneAndUpdate({_id :commentID} , {$push : {Replies : saveReply._id}} , {new : true})
        res.status(201).json({message : "Done, Create Reply" , saveReply})
    }
}




module.exports = {
    addComment,
    replyComment,
    updateComment,
    deleteComment,
    like_unlikeComment
}