const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// At the top of productController.js
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// In your create controller:
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send('Invalid input');

  const { title, description, price, category, stockQty } = req.body;
  const images = req.files.map(file => file.filename);
  const slug = slugify(title); // <-- Generate slug

  try {
    await Product.create({
      title,
      slug, // <-- Save slug
      description,
      price,
      category,
      stockQty,
      images
    });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to create product');
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, price, category, stockQty } = req.body;
    const update = { title, description, price, category, stockQty };
    await Product.findByIdAndUpdate(req.params.id, update);
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to update product');
  }
};

exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to delete product');
  }
};

exports.productDetail = async(req,res)=>{
  try{
    const product = await Products.findone({slug:req.params.slug})
    if (!product) return resstatus(404).send("product not found")

      res.render("public/product-detail",{
        title:product.title,
        product
      })
  }catch(err){
    res.status(500).send("Failed to fetch product details")
  }
}