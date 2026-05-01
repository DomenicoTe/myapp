const request = require('supertest');
const express = require('express');
const router = require('../extensions/plugin_counter/index');

describe('plugin_counter', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(router);
  });
  it('GET / should return status ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.plugin).toBe('counter');
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.count).toBe('number');
  });
});
