import request from 'supertest';
import app from '../../src/app';
import * as diceService from '../../src/services/dice.service';
import { describe, it } from 'node:test';

describe('Dice Controller', () => {
  it('GET /dice should return all dice', async () => {
    jest.spyOn(diceService, 'getAllDice').mockResolvedValue([
      {
        type: 'd6',
        label: 'D6',
        faces: 6,
        custom: false,
      },
    ]);

    const response = await request(app).get('/dice');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('POST /dice should validate body', async () => {
    const response = await request(app)
      .post('/dice')
      .send({
        label: '',
        faces: 1,
      });

    expect(response.status).toBe(400);
  });
});