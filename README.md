# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# Rapport du Projet CinémaMax

## 📋 Table des Matières
1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Fonctionnalités Principales](#fonctionnalités-principales)
4. [Composants Clés](#composants-clés)
5. [Structure des Données](#structure-des-données)
6. [Interface Utilisateur](#interface-utilisateur)
7. [Sécurité et Gestion d'Accès](#sécurité-et-gestion-daccès)
8. [Conclusion](#conclusion)

## 🎬 Introduction

CinémaMax est une application web complète de gestion de cinéma développée avec React. Elle permet aux utilisateurs de consulter les films, réserver des places, gérer leurs favoris, tandis que les administrateurs peuvent gérer l'ensemble du catalogue et des réservations.

## 🏗 Architecture du Projet

### Structure des Fichiers
```
src/
├── components/
│   ├── ProtectedRoute.js
│   ├── Toast.js
│   ├── TrailerModal.js
│   └── Navbar.js
├── context/
│   ├── UserContext.js
│   └── useFavorites.js
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Profile.js
│   ├── Reservation.js
│   ├── Payment.js
│   └── AdminDashboard.js
└── styles/
    ├── styles.css
    └── [autres fichiers CSS]
```

### Technologies Utilisées
- **Frontend** : React 18, React Router DOM
- **Backend** : JSON Server (port 5001)
- **Styling** : CSS Modules
- **Gestion d'état** : Context API

## ⚙️ Fonctionnalités Principales

### 👤 Pour les Utilisateurs
- **Inscription/Connexion** simple
- **Consultation du catalogue** de films avec filtres par catégorie
- **Système de favoris** personnel
- **Réservation de places** avec sélection visuelle des sièges
- **Paiement sécurisé** (simulé)
- **Profil utilisateur** avec historique et statistiques

### 🛠 Pour les Administrateurs
- **Tableau de bord complet** avec statistiques
- **Gestion des films** (ajout, modification, suppression)
- **Gestion des utilisateurs**
- **Suivi des réservations**
- **Analyse du chiffre d'affaires**

## 🔧 Composants Clés

### App.js - Routeur Principal
```javascript
function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reservation/:movieId" element={<Reservation />} />
            <Route path="/payment" element={<Payment />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </FavoritesProvider>
    </UserProvider>
  );
}
```

### AdminDashboard.js - Panneau d'Administration
Fonctionnalités administrateur complètes avec onglets :
- 📊 Aperçu général avec statistiques
- 🎬 Gestion des films (CRUD complet)
- 👥 Gestion des utilisateurs
- 🎫 Suivi des réservations

### Home.js - Page d'Accueil
Interface utilisateur riche avec :
- Hero section attractive
- Filtres par catégorie
- Grid responsive des films
- Modal de bandes-annonces
- Statistiques utilisateur

## 💾 Structure des Données

### Modèle Film
```javascript
{
  id: Number,
  title: String,
  category: String,
  description: String,
  duration: Number,
  rating: Number,
  price: Number,
  sessions: Array,
  trailerUrl: String,
  trailerThumbnail: String,
  seats: Object, // {"1-1": null, "1-2": userId, ...}
  createdAt: String,
  updatedAt: String
}
```

### Modèle Utilisateur
```javascript
{
  id: Number,
  name: String,
  email: String,
  password: String,
  role: String, // "user" ou "admin"
  createdAt: String
}
```

### Modèle Réservation
```javascript
{
  id: Number,
  movieId: Number,
  movieTitle: String,
  seats: Array,
  date: String,
  user: String, // email utilisateur
  price: Number
}
```

## 🎨 Interface Utilisateur

### Design System
- **Thème** : Interface moderne et cinématographique
- **Couleurs** : Palette sombre avec accents colorés
- **Typographie** : Polices lisibles et hiérarchie claire
- **Responsive** : Adaptation mobile/desktop

### Composants UI Remarquables
- **Cartes de films** avec informations complètes
- **Sélecteur de sièges** visuel et intuitif
- **Tableaux administrateur** avec actions rapides
- **Système de notifications** (Toast)
- **Modal de bandes-annonces**

## 🔐 Sécurité et Gestion d'Accès

### ProtectedRoute.js
```javascript
// Vérification des privilèges administrateur
const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useContext(UserContext);
  
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

### Gestion des Rôles
- **Utilisateur standard** : Réservations, favoris, profil
- **Administrateur** : Accès complet au dashboard admin

## 📊 Fonctionnalités Avancées

### Système de Réservation
- Vérification en temps réel de la disponibilité des sièges
- Prévention des conflits de réservation
- Calcul automatique du prix total

### Gestion des Favoris
- Persistance locale avec Context API
- Synchronisation avec le profil utilisateur

### Statistiques et Analytics
- Chiffre d'affaires en temps réel
- Taux d'occupation des séances
- Préférences des utilisateurs

## 🚀 Points Forts du Projet

1. **Code Bien Structuré** : Architecture modulaire et réutilisable
2. **Expérience Utilisateur** : Interface intuitive et responsive
3. **Gestion d'État** : Utilisation optimale de Context API
4. **Sécurité** : Protection des routes sensibles
5. **Maintenabilité** : Code documenté et séparé en composants

## 🔮 Améliorations Possibles

1. **Authentification** : Implémentation JWT pour plus de sécurité
2. **Base de Données** : Migration vers une base de données réelle
3. **Paiement** : Intégration d'une passerelle de paiement réelle
4. **Notifications** : Système de notifications push
5. **Performance** : Implémentation de lazy loading

## 💎 Conclusion

CinémaMax représente une application React complète et professionnelle pour la gestion de cinéma. Son architecture solide, son interface utilisateur soignée et ses fonctionnalités complètes en font une solution adaptée aussi bien pour les utilisateurs finaux que pour les gestionnaires de salles de cinéma.

Le projet démontre une maîtrise avancée des concepts React modernes, de la gestion d'état, du routing et de la création d'interfaces utilisateur complexes et interactives.
