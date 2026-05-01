const request = require('supertest');
const express = require('express');
const router = require('../extensions/module_check/index');

describe('module_check', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(router);
  });
  it('GET / should return status ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.module).toBe('check');
    expect(res.body.status).toBe('ok');
  });
});
