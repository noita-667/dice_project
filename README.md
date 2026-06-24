# Lancer de dés

Application web de lancer de dés avec gestion des joueurs et historique des lancers.

## Stack

| Côté       | Technologies                          |
|------------|---------------------------------------|
| Frontend   | React 19, TypeScript, Vite            |
| Backend    | Node.js, Express, TypeScript          |
| Base de données | PostgreSQL                       |
| Tests front | Vitest, React Testing Library        |
| Tests back  | Jest, Supertest                      |

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v15+

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/noita-667/de_project.git
cd de_project
```

### 2. Backend

```bash
cd Backend
npm install
```

Créer un fichier `.env` à partir de l'exemple :

```bash
cp .env.example .env
```

Remplir les variables dans `.env` :

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=dice_db
DB_USER=postgres
DB_PASSWORD=ton_mot_de_passe
```

Créer la base de données PostgreSQL :

```bash
psql -U postgres -c "CREATE DATABASE dice_db;"
```

> Les tables sont créées automatiquement au démarrage du serveur (migration automatique).

### 3. Frontend

```bash
cd front-end
npm install
```

---

## Lancer le projet

Ouvrir deux terminaux :

**Terminal 1 — Backend**
```bash
cd Backend
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd front-end
npm run dev
```

Ouvrir `http://localhost:5173` dans le navigateur.

---

## Tests

### Frontend

```bash
cd front-end
npx vitest
```

Les tests sont organisés en trois niveaux :

- `src/tests/unit/` — tests unitaires (un composant isolé)
- `src/tests/integration/` — tests d'intégration (plusieurs composants ensemble)
- `src/tests/e2e/` — tests de scénario utilisateur complet (avec fetch mocké)

### Backend

```bash
cd Backend
npm test
```

---

## Fonctionnalités

- Sélection d'un dé parmi la liste (D6, D12, D20 par défaut)
- Création de dés personnalisés avec n'importe quel nombre de faces (2 à 10 000)
- Saisie du prénom du joueur avant de lancer
- Animation visuelle au lancer
- Historique des lancers avec statistiques (meilleur score, moyenne, dé favori)
- Coloration des résultats (vert si ≥ 85%, rouge si ≤ 20% du maximum)

