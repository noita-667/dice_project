import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import App from "../../App";

test("cliquer sur Lancer appelle handleRoll", () => {
  render(<App />);
  // Sélectionner le dé et cliquer sur Lancer
  fireEvent.click(screen.getByText("D6"));
  fireEvent.click(screen.getByText("Lancer"));
  expect(screen.getByText("Lancer en cours…")).toBeInTheDocument();
});