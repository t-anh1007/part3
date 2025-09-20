const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.index);

// Admin routes (require authentication and admin role)
router.get('/admin', requireAuth, requireAdmin, productController.admin);
router.get('/create', requireAuth, requireAdmin, productController.showCreate);
router.get('/:id/edit', requireAuth, requireAdmin, productController.showEdit);
router.post('/', requireAuth, requireAdmin, productController.create);
router.put('/:id', requireAuth, requireAdmin, productController.update);
router.delete('/:id', requireAuth, requireAdmin, productController.delete);

module.exports = router;