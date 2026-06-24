# Tests backend

Le backend tourne avec **Jest** et **Supertest**. Les tests sont dans le dossier `test/`.

---

## Unitaire — `DiceService` (`test/tu/dice.service.test.ts`)

**Ce qu'on teste :** la fonction `createDice` qui crée un dé custom en base.

**Comment :** on remplace complètement la base de données par un faux objet (mock). Comme ça le test ne dépend de rien d'externe.

**Le test :** on appelle `createDice('D100', 100)` et on vérifie que le résultat a bien le bon label, le bon nombre de faces, et que `custom` vaut `true`.

---

## Intégration — `DiceController` (`test/ti/dice.controller.test.ts`)

**Ce qu'on teste :** les routes HTTP `/dice` en passant par l'appli Express, mais avec un faux service.

**Comment :** Supertest envoie de vraies requêtes HTTP en mémoire. Le service est mocké avec `jest.spyOn`.

**Les tests :**

- `GET /dice` → doit retourner un status 200 et une liste avec 1 dé
- `POST /dice` avec un body invalide (label vide, faces = 1) → doit retourner 400

---

## E2E — API `/dice` (`test/e2e/dice.e2e.test.ts`)

**Ce qu'on teste :** l'API complète, sans aucun mock. Tout est réel.

**Les tests :**

- `GET /dice` → status 200, la réponse est bien un tableau
- `POST /dice` avec un body invalide → status 400
- `GET /unknown` → status 404 (route inexistante)
