const router = require('express').Router();
const ensureAdmin = require('../middleware/admin');
const cat = require('../controllers/categoryController');

router.post('/', ensureAdmin, cat.create);
router.post('/delete/:id', ensureAdmin, cat.delete);

module.exports = router;
