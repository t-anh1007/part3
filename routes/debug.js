const express = require('express');
const router = express.Router();

// Simple debug routes
router.get('/debug', (req, res) => {
    res.json({
        message: 'Debug route working!',
        method: req.method,
        url: req.url,
        session: {
            userId: req.session?.userId,
            userRole: req.session?.userRole
        }
    });
});

router.get('/routes', (req, res) => {
    res.json({
        message: 'Available routes:',
        routes: [
            'GET /',
            'GET /products',
            'GET /products/admin',
            'GET /products/create',
            'GET /products/:id/edit',
            'POST /products',
            'PUT /products/:id',
            'DELETE /products/:id',
            'GET /suppliers',
            'GET /suppliers/create',
            'GET /suppliers/:id/edit',
            'POST /suppliers',
            'PUT /suppliers/:id',
            'DELETE /suppliers/:id'
        ]
    });
});

module.exports = router;