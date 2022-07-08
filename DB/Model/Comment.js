const mongoose = require ("mongoose")

const commentSchema = new mongoose.Schema ({
    commentBody : String,
    createdBy : [{
        type:mongoose.Schema.Types.ObjectId , ref:"User" , required : true
    }],
    ProductId : [{
        type:mongoose.Schema.Types.ObjectId , ref:"Product" , required : true
    }],
    Replies : [{
        type:mongoose.Schema.Types.ObjectId , ref:"Comment" , required : true
    }],
    liles : [{ 
        type : mongoose.Schema.Types.ObjectId , ref : "User"
    }],
},
{
    timestamps : true
})

const commentModel = mongoose.model("Comment" , commentSchema)

module.exports = commentModel