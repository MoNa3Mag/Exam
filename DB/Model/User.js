const mongoose = require ("mongoose")
const bcrybt = require('bcryptjs')

const userSchma = new mongoose.Schema({
    firstName : {
        type : String , required : true
    },
    lastName : {
        type : String , required : true
    },  
    email : {
        type : String , required : true , unique : true
    },
    password : {
        type :  String , required : true
    },
    profilePic : String,
    coverPic : Array ,
    Qr_code : String,
    confirmEmail :{
        type : Boolean , default : false
    },
    isBlooked : {
        type : Boolean , default : false
    },
    WishList : [{
        type : mongoose.Schema.Types.ObjectId , ref : "Product"
    }],
    isDeleted : {
        type : Boolean , default : false
    },
    role : {
        type : String , default : 'User'
    },
    code:String,
    socketID : String
},
{
    timestamps : true
})

userSchma.pre("save" , async function (next){
    this.password = await bcrybt.hash(this.password , parseInt(process.env.saltRound))
    next()
})

userSchma.pre("findOneAndUpdate" , async function (next){
    const hookData = await this.model.findOne(this.getQuery()).select("__v");
    this.set({__v : hookData.__v + 1})
    next()
})
const userModel = mongoose.model("User" , userSchma)

module.exports = userModel