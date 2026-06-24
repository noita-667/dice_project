import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import App from '../../App';

vi.spyOn(global, 'fetch').mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([
    { type: 'd6', faces: 6, label: 'D6', custom: false },
  ]),
} as Response);

test("lancer un dé et voir le résultat", async () => {
  render(<App />);

  // Saisir le prénom du joueur
  fireEvent.change(screen.getByPlaceholderText('Ton prénom'), { target: { value: 'Alice' } });

  // sélection du dée et lancer
  await waitFor(() => screen.getByRole('button', { name: 'D6' }));
  fireEvent.click(screen.getByRole('button', { name: 'D6' }));
  fireEvent.click(screen.getByRole('button', { name: 'Lancer' }));
// Vérifier que le résultat est affiché
  await waitFor(
    () => expect(screen.getByText(/D6 · 6 faces/i)).toBeInTheDocument(),
    { timeout: 2000 }
  );
});
