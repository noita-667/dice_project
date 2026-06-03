import request from 'supertest';
import app from '../../src/app';
import { describe, it } from 'node:test';

describe('Dice API', () => {
  it('GET /dice', async () => {
    const response = await request(app).get('/dice');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /dice with invalid body', async () => {
    const response = await request(app)
      .post('/dice')
      .set('Content-Type', 'application/json')
      .send({
        label: '',
        faces: 1,
      });

    expect(response.status).toBe(400);
  });

  it('404 route', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
  });
});