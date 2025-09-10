# LoveNow

## Configuration (Netlify)

Remplir `config.js` avec les clés publiques :

- `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID`, `FIREBASE_STORAGE_BUCKET`
- `RECAPTCHA_SITE_KEY`
- `CHAT_PROVIDER` ("recapchat" ou "none")
- `CHAT_SITE_ID`

Variables d’environnement privées à définir sur Netlify :

- `RECAPTCHA_SECRET` (clé secrète reCAPTCHA)

Le fichier `js/firebase.js` utilise ces valeurs pour initialiser Firebase.

### Règles Firestore recommandées

Voir `firestore.rules` :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

