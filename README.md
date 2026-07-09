# OMNIA - Plateforme E-commerce Multi-Boutique

## Description

OMNIA est une plateforme e-commerce SaaS (Software as a Service) qui permet de gérer plusieurs boutiques indépendantes. Chaque boutique possède son propre catalogue de produits, ses administrateurs, et ses commandes.

### Fonctionnalités principales

- **Multi-boutique** : Chaque boutique est indépendante avec ses propres produits et administrateurs
- **Catalogue produits** : Affichage, recherche, filtres (prix, genre, tailles)
- **Panier** : Ajout/suppression avec sauvegarde par boutique
- **Commandes** : Formulaire de livraison, historique des commandes
- **Paiement** : Intégration Stripe (mode test)
- **Avis clients** : Notation et commentaires sur les produits
- **Administration** : Dashboard, gestion produits, commandes et boutiques
- **Responsive** : Adapté à toutes les tailles d'écran

---

## Structure du projet
projetOmnia/
├── backend/ # API Node.js/Express
│ ├── prisma/ # Modèles de données
│ ├── middleware/ # Middlewares (auth, admin)
│ └── index.js # Point d'entrée
├── frontend/ # Application React/Vite
│ ├── src/
│ │ ├── components/ # Composants réutilisables
│ │ ├── pages/ # Pages de l'application
│ │ ├── hooks/ # Hooks personnalisés
│ │ ├── services/ # Appels API
│ │ ├── store/ # Zustand stores
│ │ └── icons/ # Icônes SVG centralisées
│ └── ...
└── docker-compose.yml # Base de données PostgreSQL


---

## Installation

### Prérequis

- Node.js (v18 ou supérieur)
- Podman ou Docker (pour la base de données)
- Compte Stripe (pour les paiements en test)

### Cloner le projet
git clone <url-du-repo>
cd projetOmnia

# Avec Podman
podman-compose up -d

# Avec Docker
docker-compose up -d

cd backend
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos informations
# - DATABASE_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - STRIPE_PUBLISHABLE_KEY

# Créer les tables et générer le client Prisma
npx prisma migrate dev --name init
npx prisma generate

# Remplir la base avec les données de test
npm run seed

# Démarrer le serveur
npm run dev

cd ../frontend
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Démarrer l'application
npm run dev

#Commandes Principales Back
npm run dev      # Mode développement
npm run seed     # Remplir la base avec des données de test
npx prisma studio # Interface graphique de la base de données

#Commandes Principales Front
npm run dev      # Mode développement
npm run build    # Construction pour la production
npm run preview  # Aperçu de la version construite

# Technologies utilisées

# Backend
Node.js + Express - Serveur API
Prisma - ORM pour PostgreSQL
JWT - Authentification
bcryptjs - Hachage des mots de passe
Stripe - Paiement


# Frontend
React + Vite - Interface utilisateur
TailwindCSS - Styles
Zustand - Gestion d'état
Axios - Requêtes HTTP
React Router - Navigation

# Base de données
PostgreSQL - Base de données relationnelle
Podman/Docker - Conteneurisation