const request = require('supertest');
const express = require('express');
const router = require('../extensions/plugin_maker/index');

describe('plugin_maker', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(router);
  });
  it('GET / should return status ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.plugin).toBe('maker');
    expect(res.body.status).toBe('ok');
  });
});
