import { createDice } from '../../src/services/dice.service';
import { pool } from '../../src/db/client';
import { describe, it } from 'node:test';

jest.mock('../../src/db/client', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('createDice', () => {
  it('should create a custom dice', async () => {
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

    const result = await createDice('D100', 100);

    expect(result.label).toBe('D100');
    expect(result.faces).toBe(100);
    expect(result.custom).toBe(true);
  });
});