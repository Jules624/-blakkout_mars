# @blakkout_mars 🌌

> Site web immersif du collectif @blakkout_mars - Événements techno/geek à Marseille

## 🔍 Présentation

Site web immersif pour le collectif @blakkout_mars, organisateur d'événements techno/geek à Marseille. L'expérience utilisateur est inspirée de l'univers du hacking, avec des effets visuels avancés (glitch, TV blackout, terminal), des animations 3D et une navigation cryptique.

Le site propose une expérience interactive unique mêlant culture underground, technologie et art numérique, avec des easter eggs cachés et des fonctionnalités cryptiques pour les utilisateurs les plus curieux.

## 🚀 Fonctionnalités

### Pages Principales
- **🏠 Landing Page** : Effet blackout TV, animations 3D, scroll reveal immersif
- **🎉 Événements** : Présentation cryptique des lieux et événements avec cartes interactives
- **🌌 Univers** : Lore du collectif avec contenu markdown révélé progressivement
- **👥 Collectif** : Présentation de l'équipe avec manifeste et système de recrutement
- **🛍️ Merchandising** : Visualisation 3D rotative des produits avec Three.js
- **🖼️ Galerie** : Interface type terminal/CLI pour naviguer dans les médias
- **📞 Contact** : Formulaire de contact avec validation et effets visuels
- **💼 Recrutement** : Système de candidature avec rôles cachés et easter eggs

### Fonctionnalités Avancées
- **🔐 Easter Eggs** : Système de codes secrets et rôles cachés
- **🎮 Mini-jeux** : Énigmes intégrées et puzzles interactifs
- **📱 Responsive** : Adaptation parfaite sur tous les appareils
- **⚡ Performance** : Optimisations SSR et lazy loading
- **🔍 SEO** : Métadonnées optimisées pour chaque page

## 🛠️ Stack Technique

### Frontend
- **⚛️ Next.js 13** : Framework React avec App Router
- **🔷 TypeScript** : Typage statique pour une meilleure robustesse
- **🎨 Tailwind CSS** : Framework CSS utilitaire
- **🎭 Framer Motion** : Animations fluides et transitions
- **🌟 GSAP** : Animations avancées et effets visuels
- **🎯 Lucide React** : Icônes modernes et cohérentes

### 3D & Interactivité
- **🎲 Three.js** : Moteur 3D pour les visualisations
- **🔧 @react-three/fiber** : Intégration React pour Three.js
- **🛠️ @react-three/drei** : Helpers et composants 3D

### Contenu & Validation
- **📝 Markdown-it** : Rendu de contenu markdown enrichi
- **✅ Zod** : Validation de schémas et formulaires
- **🔥 React Hot Toast** : Notifications utilisateur élégantes

### SEO & Thèmes
- **🔍 Next-SEO** : Optimisation pour les moteurs de recherche
- **🌙 Next-themes** : Gestion des thèmes sombre/clair

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/blakkout-mars.git
cd blakkout-mars

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

## 🏗️ Structure du Projet

```
@blakkout_mars/
├── public/
│   ├── assets/
│   │   ├── fonts/          # Polices personnalisées
│   │   ├── images/         # Images et textures
│   │   └── models/         # Modèles 3D
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── content/        # Composants de contenu
│   │   ├── effects/        # Effets visuels (TVBlackout, etc.)
│   │   ├── events/         # Composants événements
│   │   ├── layout/         # Layout et navigation
│   │   ├── merch/          # Système merchandising 3D
│   │   ├── providers/      # Providers React
│   │   └── ui/             # Composants UI réutilisables
│   ├── context/
│   │   └── EasterEggContext.tsx  # Gestion des easter eggs
│   ├── lib/
│   │   ├── seo-config.ts   # Configuration SEO
│   │   └── utils.ts        # Utilitaires
│   ├── pages/
│   │   ├── collectif.tsx   # Page équipe et recrutement
│   │   ├── contact.tsx     # Formulaire de contact
│   │   ├── evenements.tsx  # Liste des événements
│   │   ├── galerie.tsx     # Galerie média
│   │   ├── index.tsx       # Page d'accueil
│   │   ├── merch.tsx       # Boutique 3D
│   │   ├── recrutement.tsx # Système de candidature
│   │   └── univers.tsx     # Lore et contenu
│   └── styles/
│       └── globals.css     # Styles globaux et variables CSS
├── components.json         # Configuration shadcn/ui
├── next.config.js         # Configuration Next.js
├── tailwind.config.js     # Configuration Tailwind
└── tsconfig.json          # Configuration TypeScript
```

## 🎨 Composants Clés

### Effets Visuels
- **`<TVBlackout />`** : Effet de TV qui s'éteint/s'allume avec fréquence configurable
- **`<GlitchText />`** : Effet de texte glitché pour l'ambiance hacker
- **`<CircuitBackground />`** : Arrière-plan animé de circuits électroniques

### 3D & Interactivité
- **`<RotatingMerch3D />`** : Visualisation 3D rotative des produits merchandising
- **`<Interactive3DScene />`** : Scènes 3D interactives pour l'immersion

### Contenu
- **`<MarkdownReveal />`** : Révélation progressive de contenu markdown
- **`<CrypticEventCard />`** : Cartes d'événements avec style cryptique
- **`<TerminalInput />`** : Interface de terminal interactive

### Système
- **`<EasterEggProvider />`** : Gestion globale des easter eggs et codes secrets
- **`<Layout />`** : Layout principal avec navigation et footer

## 🔐 Easter Eggs & Fonctionnalités Cachées

Le site intègre plusieurs niveaux d'easter eggs :

- **Codes secrets** : Déblocage de contenu caché via des codes spéciaux
- **Rôles cachés** : Système de recrutement avec rôles secrets (ex: `BLKKT-AGENT`)
- **Mini-jeux** : Énigmes intégrées dans le contenu markdown
- **Interactions cachées** : Combinaisons de touches et clics secrets

## 🚀 Scripts Disponibles

```bash
# Développement
npm run dev          # Serveur de développement avec hot reload

# Production
npm run build        # Build optimisé pour la production
npm run start        # Serveur de production

# Qualité de code
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript
```

## 🌐 Déploiement

### Vercel (Recommandé)
```bash
# Installation de Vercel CLI
npm i -g vercel

# Déploiement
vercel
```

### Build Manuel
```bash
# Build du projet
npm run build

# Démarrer en production
npm run start
```

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env.local` :

```env
# Configuration du site
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
NEXT_PUBLIC_SITE_NAME="@blakkout_mars"

# APIs externes (si nécessaire)
NEXT_PUBLIC_CONTACT_API=votre-api-endpoint
```

### Personnalisation des Thèmes
Les couleurs et thèmes sont configurables dans `tailwind.config.js` :

```javascript
colors: {
  'blakkout-primary': '#00ff41',    // Vert Matrix
  'blakkout-secondary': '#ff0080',  // Rose cyberpunk
  'blakkout-background': '#0a0a0a', // Noir profond
  // ...
}
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créez** une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Committez** vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrez** une Pull Request

### Standards de Code
- Utiliser TypeScript pour tous les nouveaux composants
- Suivre les conventions de nommage React/Next.js
- Ajouter des commentaires pour les logiques complexes
- Tester les composants sur mobile et desktop

## 📱 Compatibilité

- **Navigateurs** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Appareils** : Desktop, Tablet, Mobile (responsive design)
- **Résolutions** : 320px à 4K+ (design adaptatif)

## 🐛 Problèmes Connus

- Les animations 3D peuvent être ralenties sur les appareils moins puissants
- Certains effets visuels nécessitent WebGL 2.0
- Le mode sombre est optimisé pour l'expérience principale

## 📄 Licence

Tous droits réservés © 2024 @blakkout_mars

Ce projet est propriétaire et confidentiel. Toute reproduction, distribution ou utilisation sans autorisation expresse est interdite.

---

**Développé avec ❤️ par le collectif @blakkout_mars**

*"Dans l'ombre des circuits, nous créons la lumière."*