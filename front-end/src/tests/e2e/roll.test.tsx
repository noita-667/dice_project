import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../../App';

beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation((url) => {
    if (String(url).includes('/dice')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ type: 'd6', faces: 6, label: 'D6', custom: false }]),
      } as Response);
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) } as Response);
  });
});

afterEach(() => vi.restoreAllMocks());


test('lancer un dé et voir le résultat', async () => {
  render(<App />);
  // Étape 1 : le joueur saisit son prénom
  fireEvent.change(screen.getByPlaceholderText('Ton prénom'), { target: { value: 'Alice' } });
  // Étape 2 : sélectionner D6 (attend que l'API mock réponde)
  await waitFor(() => screen.getByRole('button', { name: 'D6' }));
  fireEvent.click(screen.getByRole('button', { name: 'D6' }));
  // Étape 3 : lancer le dé
  fireEvent.click(screen.getByRole('button', { name: 'Lancer' }));
  await waitFor(
    () => expect(screen.getByText(/D6 · 6 faces/i)).toBeInTheDocument(),
    { timeout: 2000 }
  );
});
