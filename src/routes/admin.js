const router = require('express').Router();
const mongoose = require('mongoose');
const ensureAdmin = require('../middleware/admin');
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const upload = require('../config/upload');
const Product = require('../models/Product');


router.get('/', ensureAdmin, adminController.dashboard);
router.get('/dashboard',  ensureAdmin, adminController.dashboard);

router.post('/categories', ensureAdmin, adminController.createCategory);
router.post('/categories/delete/:id', ensureAdmin, adminController.deleteCategory);

router.post('/products', ensureAdmin, upload.array('images', 4), adminController.createProduct);
router.post('/products/delete/:id', ensureAdmin, adminController.deleteProduct);

router.get('/products/json/:id', ensureAdmin, async (req, res) => {
    try {
      const { id } = req.params;
  
      // ✅ Log incoming ID
      console.log("Fetching product for ID:", id);
  
      // ✅ Check for valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ObjectId");
        return res.status(400).json({ error: 'Invalid product ID' });
      }
  
      const product = await Product.findById(id).populate('category');
  
      if (!product) {
        console.log("Product not found");
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // ✅ Log product data (optional)
      console.log("Product found:", product);
  
      res.json(product);
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      res.status(500).json({ error: 'Server error' });
    }
  });
router.post(
    '/products/edit/:id',
    ensureAdmin,
    upload.none(), // or `upload.array('images', 4)` if you're uploading images
    productController.update
  );
router.get('/orders', ensureAdmin, adminController.adminOrders);

module.exports = router;
