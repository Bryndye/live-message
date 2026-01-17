# live-message
npm run dev : pour lancer le serveur en mode développement (avec rechargement automatique)
npm start : pour lancer le serveur en mode production

# Sanitize HTML
Le projet utilise la bibliothèque [sanitize-html](https://www.npmjs.com/package/sanitize-html) pour nettoyer les entrées utilisateur et prévenir les attaques XSS (Cross-Site Scripting). Cette bibliothèque permet de définir des règles strictes sur les balises HTML et les attributs autorisés dans les messages envoyés par les utilisateurs.

# Helmet
Le projet utilise le middleware [Helmet](https://www.npmjs.com/package/helmet) pour Express.js afin de renforcer la sécurité des applications web en définissant divers en-têtes HTTP. Helmet aide à protéger contre certaines vulnérabilités web courantes en configurant correctement les en-têtes de sécurité.