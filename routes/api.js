const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const supplierController = require('../controllers/supplierController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// API Routes for products
router.get('/products', productController.getAll);
router.post('/products', requireAuth, requireAdmin, productController.create);
router.put('/products/:id', requireAuth, requireAdmin, productController.update);
router.delete('/products/:id', requireAuth, requireAdmin, productController.delete);

// API Routes for suppliers
router.get('/suppliers', requireAuth, requireAdmin, supplierController.getAll);
router.post('/suppliers', requireAuth, requireAdmin, supplierController.create);
router.put('/suppliers/:id', requireAuth, requireAdmin, supplierController.update);
router.delete('/suppliers/:id', requireAuth, requireAdmin, supplierController.delete);

module.exports = router;