const request = require('supertest');
const express = require('express');
const router = require('../extensions/module_update/index');

describe('module_update', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(router);
  });
  it('GET / should return status ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.module).toBe('update');
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.count).toBe('number');
  });
  it('GET /up should increment count', async () => {
    const res1 = await request(app).get('/up');
    const res2 = await request(app).get('/');
    expect(res2.body.count).toBe(res1.body.count);
  });
  it('GET /down should decrement count', async () => {
    const res1 = await request(app).get('/down');
    const res2 = await request(app).get('/');
    expect(res2.body.count).toBe(res1.body.count);
  });
  it('GET /reset should reset count', async () => {
    await request(app).get('/up');
    const res = await request(app).get('/reset');
    expect(res.body.status).toBe('reset');
    expect(res.body.count).toBe(0);
  });
});
