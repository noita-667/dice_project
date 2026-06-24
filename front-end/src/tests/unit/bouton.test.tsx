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

// Remet fetch à son état d'origine après chaque test
afterEach(() => vi.restoreAllMocks());

// TEST UNITAIRE — vérifie qu'un clic sur Lancer déclenche bien l'animation
test('cliquer sur Lancer appelle handleRoll', async () => {
  render(<App />);

  // Attendre que les dés chargent depuis le mock
  await waitFor(() => screen.getByRole('button', { name: 'D6' }));

  // Sélectionner D6 pour activer le bouton Lancer
  fireEvent.click(screen.getByRole('button', { name: 'D6' }));
  fireEvent.click(screen.getByRole('button', { name: 'Lancer' }));

  // L'animation doit démarrer immédiatement
  expect(screen.getByText('Lancer en cours…')).toBeInTheDocument();
});
