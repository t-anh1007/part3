const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// All supplier routes require authentication and admin role
router.get('/', requireAuth, requireAdmin, supplierController.index);
router.get('/create', requireAuth, requireAdmin, supplierController.showCreate);
router.get('/:id/edit', requireAuth, requireAdmin, supplierController.showEdit);
router.post('/', requireAuth, requireAdmin, supplierController.create);
router.put('/:id', requireAuth, requireAdmin, supplierController.update);
router.delete('/:id', requireAuth, requireAdmin, supplierController.delete);

module.exports = router;