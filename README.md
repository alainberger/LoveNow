# LoveNow

## Configuration Firebase sur Netlify

Créer un fichier `js/firebase-config.js` (copie de `js/firebase-config.sample.js`) ou définir les variables d’environnement suivantes sur Netlify :

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_STORAGE_BUCKET`

Ces valeurs doivent correspondre à votre projet Firebase. Le fichier `js/firebase.js` lira automatiquement ces variables pour initialiser Firebase.
