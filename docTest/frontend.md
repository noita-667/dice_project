# Tests frontend

Le frontend tourne avec **Vitest** et **Testing Library**. Les tests sont dans `src/tests/`.

Le fichier `setup.ts` charge `@testing-library/jest-dom` pour pouvoir utiliser des assertions comme `toBeInTheDocument()`.

---

## Unitaire — Bouton Lancer (`src/tests/unit/bouton.test.tsx`)

**Ce qu'on teste :** que cliquer sur le bouton Lancer déclenche bien l'animation.

**Comment :** on rend `App` directement. Les appels réseau échouent silencieusement, mais les dés par défaut (D6, D12, D20) sont quand même affichés.

**Le test :** clic sur D6, puis clic sur Lancer → le bouton doit afficher `"Lancer en cours…"`.

---

## Intégration — Sélection + lancer (`src/tests/integration/dé.test.tsx`)

**Ce qu'on teste :** que le flux sélection → lancer → affichage du résultat fonctionne bien ensemble.

**Comment :** `fetch` est mocké pour retourner un seul dé D6. On attend que le composant charge les dés avant d'interagir.

**Le test :** on sélectionne D6, on clique Lancer, on attend que `"D6 · 6 faces"` apparaisse dans la page (timeout 1 500 ms, le temps de l'animation).

---

## E2E — Parcours complet (`src/tests/e2e/roll.test.tsx`)

**Ce qu'on teste :** le parcours utilisateur complet, avec la saisie du prénom.

**Comment :** même setup que l'intégration (fetch mocké), mais on simule aussi la saisie du champ joueur.

**Le test :** on tape `"Alice"` dans le champ prénom, on sélectionne D6, on clique Lancer, on vérifie que `"D6 · 6 faces"` est affiché (timeout 2 000 ms).

**Différence avec le test d'intégration :** ce test couvre en plus le champ joueur, ce qui teste une étape supplémentaire du formulaire.
