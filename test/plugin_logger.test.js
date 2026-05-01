const request = require('supertest');
const express = require('express');
const router = require('../extensions/plugin_logger/index');

describe('plugin_logger', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });
  it('GET / should return status ok', async () => {
    const res = await request(app).get('/');
    expect(res.body.plugin).toBe('logger');
    expect(res.body.status).toBe('ok');
  });
  it('POST / should echo received body', async () => {
    const res = await request(app).post('/').send({msg: 'test'});
    expect(res.body.status).toBe('ok');
    expect(res.body.received).toEqual({msg: 'test'});
  });
});
