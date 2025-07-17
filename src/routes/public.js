const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const Category = require('../models/Category')

router.get('/products',async(req,res)=>{
    const {category, minPrice, maxPrice, page=1, limit=9}=req.query
    const query={}
    if (category) query.category=category
    if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: minPrice }), ...(maxPrice && { $lte: maxPrice }) };
    const products = await Product.find(query)
    .populate('category')
    .skip((page-1)*limit)
    .limit(parseInt(limit))
    const total = await Product.countDocuments(query)
    const categories = await Category.find()
    res.render('public/products', {
        title: 'Products',
        products,
        categories,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        filters: { category, minPrice, maxPrice }
      });
router.get('/products/:slug', async (req, res) => {
        const product = await Product.findOne({ slug: req.params.slug }).populate('category');
        if (!product) return res.status(404).send('Product not found');
      
        res.render('public/product-detail', {
          title: product.title,
          product
        });
      });
      

})

module.exports=router