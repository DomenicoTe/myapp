const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ plugin: "hello", status: 'ok' });
});

module.exports = router;