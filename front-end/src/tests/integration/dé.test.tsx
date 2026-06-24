import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, test, expect, beforeEach, afterEach } from 'vitest';
import App from "../../App";



test('sélectionner D6 et cliquer Lancer affiche un résultat', async () => {
  render(<App />);

  // Attendre que les dés chargent depuis le mock
  await waitFor(() => screen.getByRole('button', { name: 'D6' }));

  fireEvent.click(screen.getByRole('button', { name: 'D6' }));
  fireEvent.click(screen.getByRole('button', { name: 'Lancer' }));

  // Après l'animation (800ms), le label du dé doit apparaître dans DiceResult
  await waitFor(
    () => expect(screen.getByText(/D6 · 6 faces/i)).toBeInTheDocument(),
    { timeout: 1500 }
  );
});
