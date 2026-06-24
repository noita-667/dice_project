import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from '../../App';


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
