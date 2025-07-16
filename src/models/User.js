const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId:{
        type:String,
        required:true
    },
    name:String,
    email:String,
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('User',UserSchema)