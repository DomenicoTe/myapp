const express = require('express');
const router = express.Router();

let count = 0;

router.get('/', (req, res) => {
    res.json({ module: "update", status: 'ok', count });
});
router.get('/up', (req, res) => {
    count++;
    res.json({ module: "update", status: 'ok', count });
});
router.get('/down', (req, res) => {
    count--;
    res.json({ module: "update", status: 'ok', count });
});
router.get('/reset', (req, res) => {
    count = 0;
    res.json({ module: "update", status: 'reset', count });
});

module.exports = router;

