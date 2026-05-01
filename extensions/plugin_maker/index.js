const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ plugin: "maker", status: 'ok' });
});

module.exports = router;