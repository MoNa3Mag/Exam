const mongoose = require ("mongoose")


const productSchema = new mongoose.Schema({
    title : {
        type : String , required : true
    },
    desc : {
        type : String , required : true
    },
    price : {
        type : String , required : true
    },
    liles : [{ 
        type : mongoose.Schema.Types.ObjectId , ref : "User"
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true
    },
    Hidden : {
        type : Boolean , default : false
    },
    isDeleted : {
        type : Boolean , default : false
    },
    Comments : [{
        type : mongoose.Schema.Types.ObjectId , ref : "Comment"
    }],
    Wishlists  : [{
        type : mongoose.Schema.Types.ObjectId , ref : "User"
    }],
    QRcode : [{
        type : String
    }]
},
{
    timestamps : true
})

const productModel = mongoose.model("Product" , productSchema)

module.exports = productModel