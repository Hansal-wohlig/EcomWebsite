const router = require('express').Router();
const ensureAdmin = require('../middleware/admin');
const adminController = require('../controllers/adminController');
const upload = require('../config/upload');

router.get('/', ensureAdmin, adminController.dashboard);
router.get('/dashboard',  ensureAdmin, adminController.dashboard);

router.post('/categories', ensureAdmin, adminController.createCategory);
router.post('/categories/delete/:id', ensureAdmin, adminController.deleteCategory);

router.post('/products', ensureAdmin, upload.array('images', 4), adminController.createProduct);
router.post('/products/delete/:id', ensureAdmin, adminController.deleteProduct);

module.exports = router;
