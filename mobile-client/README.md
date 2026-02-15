# GetHotel – Application mobile client (React Native / Expo)

Application mobile **client** pour GetHotel : accueil, recherche d'hôtels, réservation, connexion, tableau de bord et mes réservations. Elle utilise la **même API** que le frontend web (backend Node.js du projet).

## Prérequis

- **Node.js** 18+
- **npm** ou **yarn**
- **Expo Go** sur smartphone (optionnel, pour tester sans émulateur) : [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)
- Pour Android : émulateur ou appareil
- Pour iOS : Mac avec Xcode (ou Expo Go sur iPhone)

## Installation

```bash
cd mobile-client
npm install
```

## Configuration de l'API

L’app appelle le backend par défaut à l’adresse : `http://localhost:3000/api`.

- **Émulateur Android** : remplacer `localhost` par `10.0.2.2` dans `src/config/api.js` (ou utiliser l’IP de votre machine).
- **Appareil physique** : utiliser l’IP de votre ordinateur sur le réseau (ex. `http://192.168.1.10:3000/api`).

Modifier la constante `API_BASE_URL` dans `src/config/api.js` :

```js
const API_BASE_URL = 'http://VOTRE_IP:3000/api';
```

Pensez à lancer le **backend** du projet (dossier `backend`) avant de lancer l’app mobile.

## Lancer l’application

```bash
npm start
```

Puis :

- **Appareil** : scanner le QR code avec Expo Go (Android) ou l’app Caméra (iOS).
- **Android** : `a` dans le terminal ou `npm run android` (avec émulateur configuré).
- **iOS** : `i` dans le terminal ou `npm run ios` (sur Mac avec Xcode).

## Structure des écrans (interfaces client)

| Écran            | Description                                      |
|------------------|--------------------------------------------------|
| **Accueil**      | Page d’accueil, lien vers recherche et connexion |
| **Recherche**    | Liste des hôtels, recherche par ville/nom       |
| **Détail hôtel** | Fiche hôtel, bouton Réserver                     |
| **Réservation**  | Formulaire (dates, voyageurs), envoi à l’API     |
| **Connexion**    | Login (email / mot de passe)                     |
| **Inscription**  | Création de compte client                        |
| **Compte**       | Tableau de bord (si connecté) ou invitation à se connecter |
| **Mes réservations** | Liste des réservations du client (si connecté) |
| **À propos**     | Page À propos de GetHotel                        |

## Navigation

- **Onglets** : Accueil, Recherche, Réservations, Compte.
- **Pile d’écrans** : Détail hôtel, Réservation, À propos, Connexion, Inscription.

## Technologies

- **Expo** (~51)
- **React Navigation** (Stack + Bottom Tabs)
- **Axios** pour les appels API
- **AsyncStorage** pour le token et l’utilisateur (connexion persistante)

## Build de production (APK / AAB / IPA)

Voir la doc Expo : [Building standalone apps](https://docs.expo.dev/build/introduction/).  
En résumé : compte Expo, puis `eas build` pour générer les binaires.

---

L’API backend doit être déployée et accessible depuis le réseau utilisé par l’app (même LAN ou URL publique selon le cas).
