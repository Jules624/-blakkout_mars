# @blakkout_mars - Site Web Immersif

## 🔍 Présentation

Site web immersif pour le collectif @blakkout_mars, organisateur d'événements techno/geek à Marseille. L'expérience utilisateur est inspirée de l'univers du hacking, avec des effets visuels avancés (glitch, TV blackout, terminal), des animations 3D et une navigation cryptique.

## 🚀 Fonctionnalités

- **Landing Page Immersive** : Effet blackout TV, animations 3D, scroll reveal
- **Fiches Événements** : Présentation cryptique des lieux et événements
- **Univers** : Lore du collectif avec mini-jeux et énigmes en markdown
- **Merchandising** : Visualisation 3D des produits
- **Galerie** : Interface type terminal/CLI pour naviguer dans les médias
- **Sections Cachées** : Easter eggs et puzzles pour les utilisateurs curieux

## 🛠️ Stack Technique

- **Framework** : Next.js avec TypeScript
- **Styling** : Tailwind CSS avec shadcn/ui
- **Animations** : Framer Motion, GSAP, @react-three/fiber
- **Contenu** : Markdown-it pour le contenu cryptique
- **SEO** : Next-SEO pour l'optimisation
- **Validation** : Zod pour la validation des données

## 📦 Installation

```bash
# Cloner le dépôt
git clone [url-du-repo]

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🏗️ Structure du Projet

```
/src
  /components      # Composants réutilisables
  /features        # Fonctionnalités spécifiques
  /merch           # Système de merchandising
  /events          # Gestion des événements
  /universe        # Contenu lié à l'univers du collectif
  /gallery         # Galerie média
  /hooks           # Custom hooks React
  /lib             # Utilitaires et fonctions
  /styles          # Styles globaux
  /context         # Contextes React
  /data            # Données statiques
  /schemas         # Schémas de validation Zod
/public
  /assets          # Assets statiques
  /fonts           # Polices personnalisées
```

## 🎨 Composants Clés

- `<TVBlackout />` : Effet de TV qui s'éteint/s'allume
- `<RotatingMerch3D />` : Visualisation 3D rotative des produits
- `<CrypticEventCard />` : Carte d'événement avec style cryptique
- `<MarkdownReveal />` : Révélation progressive de contenu markdown
- `<TerminalInput />` : Interface de terminal interactive
- `<EasterEggProvider />` : Gestion des easter eggs cachés

## 🔐 Sécurité

Le site intègre des fonctionnalités de chiffrage pour les formulaires de contact et utilise des pratiques sécurisées pour la gestion des données utilisateur.

## 📱 Responsive

Conception adaptative pour tous les appareils, du mobile au desktop, avec une expérience utilisateur optimisée pour chaque format.

## 🚀 Déploiement

```bash
# Build du projet
npm run build

# Démarrer en production
npm run start
```

## 📄 Licence

Tous droits réservés © @blakkout_mars