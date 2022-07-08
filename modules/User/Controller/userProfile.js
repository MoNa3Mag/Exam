const userModel = require("../../../DB/Model/User")
const jwt = require ("jsonwebtoken");
const sendEmail = require("../../../Service/sendEmail");
const openURL = require("openurl")
const bcrybt = require("bcryptjs");
const productModel = require("../../../DB/Model/Product");
const commentModel = require("../../../DB/Model/Comment");
const paginate = require("../../../Service/paginate");



const signup = async (req , res) =>{
try {
    
    const {firstName , lastName, email , password} = req.body;
    const newUser = new userModel ({firstName , lastName, email , password});
    const savedUser = await newUser.save();
    const token = jwt.sign({id : savedUser._id , email : savedUser.email , role : savedUser.role}
        , process.env.emailTokenSecreat , {expiresIn : 5*60})
    const URL = `${req.protocol}://${req.headers.host}/api/v1/user/confirmEmail/${token}`
    const URL2 = `${req.protocol}://${req.headers.host}/api/v1/user/refreshToken/${savedUser._id}`
    const message = `<a href = '${URL}'>Click here to confirm'</a> <br> <a href= '${URL2}'>Refresh token'</a>`
    await sendEmail(savedUser.email , message)
    res.status(201).json({message : "Done" , savedUser})
} catch (error) {
        if (error.keyValue?.email) {
            res.status(404).json({message:"email exist" , error})
        }
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);
}
}

const confirm = async (req , res) =>{
    try {
    const {token} = req.params;
    if (!token || token == null || token == undefined) {
        res.status(403).json({message : "in-valid email token"})
    } else {
        const decoded = jwt.verify(token , process.env.emailTokenSecreat)
        if (!decoded) {
            res.status(400).json({message:"in-valid decoded token"})
        } else {
            const findUser = await userModel.findById(decoded.id).select("confirmEmail")
            if (!findUser) {
                res.status(400).json({message:"in-valid account"})
            } else {
                if (findUser.confirmEmail) {
                    res.status(400).json({message:"Account already confirmed plz login"})
                } else {
                    await userModel.findOneAndUpdate({_id : findUser._id} , {confirmEmail : true} , {new : true})
                    res.status(200).json(openURL.open('confirmPage.html'))
                }
            }
        }
    }

    } catch (error) {
     res.status(500).json({message:"Catch Error" , error})
     console.log(error);
    }
}

const refreshToken = async (req , res) =>{
    try {
        const {id} = req.params;
        const user = await userModel.findById(id).select("confirmEmail email")
        if (!user) {
            res.status(404).json({ message: "not found account" })
        } else {
            if (user.confirmEmail) {
                res.status(400).json({ message: "already confirmed" })
            } else {
               const token = jwt.sign({id : user._id} , process.env.emailTokenSecreat, { expiresIn: 2 * 60 })
               const link = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
               const link2 = `${req.protocol}://${req.headers.host}/api/v1/auth/refreshToken/${user._id}`
               const message = `<a href='${link}'> plz follow me to confirm u account</a> 
               <br>
               <a href='${link2}'>re-send confirmationEmail</a>
               `
               sendEmail(user.email, message)
               res.status(200).json(openURL.open('refreshTokenPage.html'))
            }
        }

    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);
    }
}

const signin = async (req , res) =>{
    try {
        const {email , password} = req.body;
        const checkUser = await userModel.findOne({email , confirmEmail : true , isBlooked : false , isDeleted : false})
        if (!checkUser) {
            res.status(404).json({message:"not found email"})
        } else {
            if (checkUser.isBlooked == true) {
                res.status(404).json({message:"user account is blooked"})
            } else {
               if (checkUser.isDeleted == true) {
                res.status(404).json({message:"user account is deleted"})
               } else {
                const match = await bcrybt.compare(password , checkUser.password)
                if (!match) {
                    res.status(404).json({message:"password is not matching"})
                } else {
                    const token = jwt.sign({id : checkUser._id , email : checkUser.email , role : checkUser.role} , process.env.emailTokenSecreat)
                    res.status(200).json({message:"Done" , token})
                }
               } 
            }
        
        }

    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);
    }
}

const updateProfile = async (req , res)=>{
    try {
        const {id} = req.user
        const {email , newEmail , oldPassword , newPassword} = req.body;
        const findUser = await userModel.findOne({email})
        console.log(findUser);
        if (!findUser) {
            res.status(404).json({message:"Not found user"})
        } else {
            if (findUser.id == id) {
                console.log(findUser.id);
                console.log(req.user.id);
                console.log(findUser.id == req.user.id);
                if (oldPassword == newPassword) {
                    res.status(400).json({message : "newPass cannot equal oldPass"})
                } else {
                    const match = await bcrybt.compare(oldPassword , findUser.password)
                    if (!match) {
                        res.status(400).json({message : "in-valid  oldPass"})
                    } else {
                        const hashPassword = await bcrybt.hash(newPassword , parseInt(process.env.saltRound))
                        const updated = await userModel.findOneAndUpdate({email} , {password:hashPassword , email : newEmail} , {new : true})
                        const token = jwt.sign({id : findUser._id , email : findUser.email , role : findUser.role} , 
                        process.env.emailTokenSecreat , {expiresIn : 5*60})
                        const URL = `${req.protocol}://${req.headers.host}/api/v1/user/confirmEmail/${token}`
                        const message  = `<a href='${URL}'>Click here to confirm email</a>`
                        await sendEmail(findUser.email , message)
                        res.status(200).json({message:"updated" , updated})
                    }
                }
            } else {
                res.status(400).json({message : "Sorry, not account owner"})
            }
        }
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const deleteUser = async (req , res)=>{
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email})
        if ( user.id == req.user.id || req.user.role == 'Admin') {
            const deleted = await userModel.findOneAndDelete({email:email} , {new : true})
            if (deleted) {
                res.status(200).json({message : "Account is deleted" , deleted})
            } else {
                res.status(404).json({message : "Account not found"})
            }
        } else {
            res.status(400).json({message : "Sorry, not account owner"})
        }

    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const profilePic = async (req , res)=>{
    try {
        if (req.fileErr) {
            res.status(400).json({ message: "file error" })
        } else {
            const iamgeUrl = `${req.finialDestination}/${req.file.filename}`
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { profilePic: iamgeUrl }, { new: true })
            res.status(200).json({ message: "Done", user })
        }
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const coverPic = async (req , res)=>{
    try {
        if (req.fileErr) {
            res.status(400).json({ message: "file error" })
        } else {
            const iamgeUrls = []
            req.files.forEach(file => {
                iamgeUrls.push(`${req.finialDestination}/${file.filename}`)
            });
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { coverPic: iamgeUrls }, { new: true })
            res.status(200).json({ message: "Done", user })
        }
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const sendCode = async (req , res)=>{
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email})
        if (!user) {
            res.status(404).json({message : "not found user"})
        } else {
            const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
           message = `<p>user this code to update you password : ${code}</p>`
           const send = await userModel.findByIdAndUpdate(user._id, { code } , {new : true})
           sendEmail(email, message)
           res.status(200).json({ message: "Done" , send})
        }
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const forgetPassword = async (req , res)=>{
    try {
        const {email , code , newPassword} = req.body;
        const user = await userModel.findOne({email})
        if (!user) {
            res.status(404).json({message : "not found user"})
        } else {
            if (user.code.toString() != code.toString()) {
                res.status(409).json({ message: "wrong code" })
            } else {
              const hashPassword = await bcrybt.hash(newPassword , parseInt(process.env.saltRound))
              await userModel.findByIdAndUpdate(user._id , {password : hashPassword , code : ""})
              res.status(200).json({ message: "Done plz go sinin" })
            }
        }
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const softDeleted = async (req , res)=>{
    try {
        const {email} = req.body
        const deleted = await userModel.findOneAndUpdate({email} , {isDeleted : true} , {new : true})
        res.status(200).json({messgae : "Done" , deleted})
    } catch (error) {
        res.status(500).json({message:"Catch Error" , error})
        console.log(error);   
    }
}

const getUsers = async (req , res)=>{
    const {page , size} = req.query
    const {skip , limit} = paginate(page , size)
    const products = []
    const comments = []
    const Wishlists = []
    for await (const doc of userModel.find().limit(limit).skip(skip)) {
        const productsOfUsers = await productModel.find({createdBy : doc._id})
        for await (const doc1 of productsOfUsers){
            const commentsOfProduct = await commentModel.find({ProductId : doc1._id})
            comments.push({comments : commentsOfProduct})
            for await (const doc3 of commentsOfProduct){
                doc3.Replies.forEach(async element => {
                    const repliesOfComments = await commentModel.find({_id : element})
                    comments.push({Replies : repliesOfComments})
                });
            }
        }
        for await (const doc2 of productsOfUsers){
            const wishlistOfProduct = await productModel.find({Wishlists : doc2._id})
            Wishlists.push({Wishlists : wishlistOfProduct})
        }

        products.push({userInfo : doc , products : productsOfUsers , CommentsAndReply : comments , wishLIST : Wishlists})
      }
      res.status(200).json({message : "Done" , products})
}

module.exports = {
    signup,
    confirm,
    refreshToken,
    signin,
    updateProfile,
    deleteUser,
    profilePic,
    coverPic,
    sendCode,
    forgetPassword,
    softDeleted,
    getUsers
}

