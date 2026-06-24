import { createDice } from '../../src/services/dice.service';
import { pool } from '../../src/db/client';

// Remplacement des appels à la base par des faux appels
jest.mock('../../src/db/client', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('createDice', () => {
  // Vérifie qu'un dé personnalisé est bien créé
  it('should create a custom dice', async () => {
    // Simulation de données que la base doit renvoyer
    (pool.query as jest.Mock).mockResolvedValue({
      rows: [
        {
          type: 'custom-12345678',
          label: 'D100',
          faces: 100,
          custom: true,
        },
      ],
    });

    // Appel de la fonction à tester
    const result = await createDice('D100', 100);

    // Vérification des données reçues
    expect(result.label).toBe('D100');
    expect(result.faces).toBe(100);
    expect(result.custom).toBe(true);
  });
});