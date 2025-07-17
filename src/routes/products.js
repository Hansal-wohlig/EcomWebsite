const router = require('express').Router();
const { body } = require('express-validator');
const ensureAdmin = require('../middleware/admin');
const upload = require('../config/upload');
const prod = require('../controllers/productController');

router.post(
  '/',
  ensureAdmin,
  upload.array('images', 4),
  [
    body('title').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty()
  ],
  prod.create
);

router.post('/update/:id', ensureAdmin, prod.update);
router.post('/delete/:id', ensureAdmin, prod.remove);
router.get('/products/json/:id', ensureAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.json(product)
})


module.exports = router;
