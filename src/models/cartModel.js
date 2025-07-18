const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId, ref:"Product",required:true},
    quantity:{type:Number,default:1,min:1},
    price:{type:Number,required:true}
})

const cartSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User",required:true, unique:true},
    items:[cartItemSchema],
    totalPrice:{type:Number,default:0}
})

cartSchema.methods.calculateTotal = function(){
    this.totalPrice = this.items.reduce((sum,item)=> sum+item.price*item.quantity,0)
}

module.exports = mongoose.model("Cart",cartSchema)