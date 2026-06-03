# Dice Roller — Front-end

Interface de lancer de dés (D6, D12, D20) en React + TypeScript.

## Stack

- React 18
- TypeScript
- Vite

## Installation

```bash
npm install
npm run dev
```

## Structure
src/
├── types/
│   └── dice.ts            # Types et config des dés
├── hooks/
│   └── useRollHistory.ts  # State de l'historique des lancers
├── components/
│   ├── DicePicker.tsx     # Sélection du dé
│   ├── DiceResult.tsx     # Affichage du résultat
│   └── RollHistory.tsx    # Liste des lancers
└── App.tsx                # Composant racine

## Fonctionnement

1. L'utilisateur sélectionne un dé (D6, D12 ou D20)
2. Il clique sur **Lancer**
3. Le résultat s'affiche et s'ajoute à l'historique en mémoire

> L'historique est en mémoire uniquement (pas de persistance côté front).
> La sauvegarde est gérée par le back-end via API.

## Connexion au back-end

Les appels API sont à brancher dans `src/hooks/useRollHistory.ts`.