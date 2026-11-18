# Voyages Redux

Variante du projet **Voyages**, utilisée pour introduire **Redux Toolkit** dans l'application, avec une authentification branchée sur une vraie API (plus DummyJSON).

Projet pédagogique (Cloud Campus) : un site de découverte de destinations de voyage, réalisé avec **React 19 + Vite**, **React Router**, **React Bootstrap**, **React Hook Form**, **Yup** et **Redux Toolkit**.

## Fonctionnalités

- Liste et détail des destinations, avec recherche par mot-clé et filtre par région
- Authentification (inscription, connexion, déconnexion, profil) via une API REST réelle
- Rôles utilisateur : un compte `user` normal et un rôle `admin`
- Page Administration (réservée au rôle `admin`) listant les demandes de contact
- Formulaire de contact, lié au compte connecté si l'utilisateur est authentifié
- Favoris par utilisateur connecté (stockés dans le `localStorage`)
- Thème clair / sombre (accessibilité), mémorisé d'une visite à l'autre

## Redux

Le store Redux Toolkit (`src/app/store.js`) gère deux slices :

- `src/features/auth/authSlice.js` : connexion, inscription, déconnexion, profil (`loginUser`, `registerUser`, `fetchProfile`, `logout`)
- `src/features/contact/contactSlice.js` : envoi d'une demande de contact et consultation (admin) des demandes (`submitContactMessage`, `fetchContactMessages`)

Les appels HTTP passent par un client centralisé (`src/api/apiClient.js`).

Les favoris et le thème restent gérés par des Context React (`FavoritesContext`, `ThemeContext`), non migrés vers Redux.

## Restrictions d'accès

- `ProtectedRoute` : redirige vers `/login` si personne n'est connecté (routes `/profile`, `/favorites`)
- `AdminRoute` : redirige vers `/login` si non connecté, vers `/` si connecté sans le rôle `admin` (route `/admin`)
- `GuestRoute` : redirige un utilisateur déjà connecté hors des pages `/login` et `/register`

## Démarrer le projet en local

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement GitHub Pages

Le projet est prêt à être publié en tant que *project page* GitHub Pages, à l'adresse `https://<compte>.github.io/voyages-redux/` :

- `vite.config.js` définit `base: '/voyages-redux/'`
- `src/router/Router.jsx` utilise `basename: import.meta.env.BASE_URL`
- `public/404.html` + le script dans `index.html` gèrent le rafraîchissement/l'accès direct à une route interne (technique [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages))
- `.github/workflows/deploy.yml` build et déploie automatiquement à chaque push sur `main`

Pour activer le déploiement après le premier push : dans les paramètres du dépôt GitHub, **Settings → Pages → Source → GitHub Actions**.
