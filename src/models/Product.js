const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title:{ type:String, required:true, trim:true},
    description:{type:String},
    price:{type:Number, required:true, min:0},
    images:[String],
    stockQty:{type:Number, default:0, min:0},
    category:{type:mongoose.Schema.Types.ObjectId, ref:'Category',required:true},
    isActive:{type:Boolean, default:true}
},
{timestamps:true}
)

module.exports = mongoose.model('Product',ProductSchema)