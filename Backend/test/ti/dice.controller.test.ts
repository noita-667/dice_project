import request from 'supertest';
import app from '../../src/app';
import * as diceService from '../../src/services/dice.service';

describe('Dice Controller', () => {
  // Vérification que la route retourne bien la liste des dés
  it('GET /dice should return all dice', async () => {
    // Simulation de la réponse du service
    jest.spyOn(diceService, 'getAllDice').mockResolvedValue([
      {
        type: 'd6',
        label: 'D6',
        faces: 6,
        custom: false,
      },
    ]);

    // Requête HTTP vers l'API
    const response = await request(app).get('/dice');

    // Vérification que tout s'est bien passé
    expect(response.status).toBe(200);
    // Vérification qu'un dé a été renvoyé
    expect(response.body).toHaveLength(1);
  });

  // Vérification que les données invalides sont refusées
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