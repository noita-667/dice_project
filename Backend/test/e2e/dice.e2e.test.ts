import request from 'supertest';
import app from '../../src/app';

describe('Dice API', () => {
  // Vérification que la route GET /dice fonctionne
  it('GET /dice', async () => {
    const response = await request(app).get('/dice');

    expect(response.status).toBe(200);
    // Vérification que la réponse est un tableau
    expect(Array.isArray(response.body)).toBe(true);
  });

   // Vérification d'une mauvaise requête est rejetée
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

  // Vérification du comportement sur une route inexistante
  it('404 route', async () => {
    const response = await request(app).get('/unknown');

    expect(response.status).toBe(404);
  });
});