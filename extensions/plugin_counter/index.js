const express = require('express');
const router = express.Router();

class Counter {
    #interval    
    constructor() {
        this.count = 0;
    }
    start() {
        this.#interval = setInterval(() => {
            this.count++;
        }, 1000);
    }
    stop() {
        clearInterval(this.#interval);
    }
    reset() {
        this.count = 0;
    }
}

const counter = new Counter();

router.get('/start', (req, res) => {
    counter.start();
    res.json({ plugin: "counter", status: 'started' });
});

router.get('/stop', (req, res) => {
    counter.stop();
    res.json({ plugin: "counter", status: 'stopped' });
});

router.get('/reset', (req, res) => {
    counter.reset();
    res.json({ plugin: "counter", status: 'reset' });
});

router.get('/', (req, res) => {
    res.json({ plugin: "counter", status: 'ok', count: counter.count });
});

module.exports = router;