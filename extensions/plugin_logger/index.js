const express = require('express');
const router = express.Router();
const debug = require('@myapp/debug')('plugin_hello');
router.post('/', (req, res) => {
    debug(`Received log: ${JSON.stringify(req.body)}`);
    res.json({ status: 'ok' , received: req.body });
});
router.get('/', (req, res) => {
    res.json({ plugin: "logger", status: 'ok', message: req.query.message});
});
module.exports = router;