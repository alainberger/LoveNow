# LoveNow

Plateforme de rencontres LoveNow (statique) avec intégration Firebase/Firestore et conformité RGPD renforcée.

## Prérequis

- Node.js 18+
- Compte Firebase (Auth + Firestore)
- Compte Cloudinary (hébergement images)
- Compte Netlify (déploiement)

## Configuration

1. **Variables d'environnement**
   - Copiez `.env.example` en `.env` et renseignez vos clés Firebase et Cloudinary.
   - Générer un fichier `public/env.js` (ou utiliser `public/env.sample.js` comme base) qui expose les mêmes valeurs côté client :

     ```js
     window.__ENV__ = {
       FIREBASE_API_KEY: '...'
       // etc.
     };
     ```

   - Ces variables sont lues par `config.js` et `assets/js/siteConfig.js`.

2. **Firebase**
   - Activez Email/Password dans Firebase Auth.
   - Créez Firestore en mode production.
   - Déployez les règles Firestore depuis `firestore.rules`.

3. **Cloudinary**
   - Créez un preset d'upload unsigned restreint (`CLOUDINARY_UPLOAD_PRESET`).
   - Ajoutez les contraintes (format, taille) côté Cloudinary.

4. **Netlify**
   - Ajoutez les mêmes variables d'environnement dans les paramètres du site.
   - Les en-têtes de sécurité et redirections sont définis dans `netlify.toml`.

## Scripts npm

| Commande        | Description                         |
|-----------------|-------------------------------------|
| `npm start`     | Sert le site en local (`npx serve`). |
| `npm test`      | Lancement des tests unitaires.       |
| `npm run build` | Build statique (noop).               |

## Développement local

1. `npm install`
2. Renseignez les variables d'environnement.
3. Lancez `npm start` puis ouvrez [http://localhost:3000](http://localhost:3000).

## Déploiement

1. Définissez les variables d'environnement sur Netlify.
2. Poussez sur la branche principale ou ouvrez une PR.
3. Netlify appliquera les en-têtes de sécurité et la redirection SPA.

## Support & conformité

- DPO : `DPO_CONTACT_EMAIL`
- Support : `SUPPORT_EMAIL`

Mise à jour de la politique de confidentialité et des cookies via `assets/js/siteConfig.js` (la date est calculée depuis `document.lastModified`).

## Tests

Les tests Playwright/Cypress sont en cours d'écriture. Utilisez `npm test` pour les tests unitaires existants.
