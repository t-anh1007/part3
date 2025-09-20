const express = require('express');
const router = express.Router();

// Test route to check method override
router.put('/test-update', (req, res) => {
    console.log('TEST UPDATE ROUTE HIT!', {
        method: req.method,
        body: req.body,
        params: req.params
    });
    
    res.json({
        success: true,
        message: 'Method override working!',
        method: req.method,
        body: req.body
    });
});

router.get('/test-form', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test Method Override</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <h2>Test Method Override</h2>
                <form action="/test/test-update" method="POST">
                    <input type="hidden" name="_method" value="PUT">
                    <div class="mb-3">
                        <label class="form-label">Test Field:</label>
                        <input type="text" name="testField" class="form-control" value="test value" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Test PUT Request</button>
                </form>
                <hr>
                <p>Expected: Method override should convert POST to PUT</p>
                <p>Check console logs in terminal</p>
            </div>
        </body>
        </html>
    `);
});

module.exports = router;