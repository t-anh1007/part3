const express = require('express');
const router = express.Router();

// Home page redirects to products
router.get('/', (req, res) => {
  res.redirect('/products');
});

module.exports = router;