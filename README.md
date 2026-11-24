# AYIKOUE — Portfolio

Portfolio personnel de AYIKOUE Amavi Hypolyte, développeur web full-stack junior. Site statique React, Vite et TypeScript, publié gratuitement sur GitHub Pages. Le formulaire de contact s’appuie sur Formspree ; aucun serveur personnalisé ni secret n’est nécessaire.

## Prérequis et installation

- Node.js 22 ou version compatible
- npm

```bash
npm install
npm run dev
```

Le serveur local affiche l’adresse à ouvrir. Pour vérifier la version de production :

```bash
npm run build
npm run preview
```

## Organisation

- `src/App.tsx` : sections et composants de la page
- `src/data/portfolio.ts` : coordonnées, projets, compétences et formations
- `src/config/public.ts` : identifiants publics des services externes
- `src/styles.css` : identité visuelle et règles responsive
- `public/` : favicon, robots.txt, sitemap et page 404
- `public/event-flow-app/` : build statique du véritable frontend SaaS EVENT-FLOW
- `.github/workflows/deploy.yml` : construction et publication automatiques

## Modifier le contenu

Les coordonnées, compétences, formations et projets sont définis dans `src/data/portfolio.ts`. Modifiez les entrées existantes en conservant leur structure. Les identifiants publics de services tiers se trouvent dans `src/config/public.ts`. La fiche EVENT-FLOW intègre une version statique du véritable frontend SaaS construit dans `files-pasted-by-the-user-master/work/event-flow/apps/web`. Pour l’actualiser, lancez `npm --prefix apps/web run build:portfolio-preview` depuis le projet EVENT-FLOW puis copiez `apps/web/dist/` dans `public/event-flow-app/` du portfolio avant de publier. Le mode d’aperçu masque le sélecteur de pays et utilise le chemin GitHub Pages du portfolio.

Pour renseigner la disponibilité, modifiez le libellé « À préciser » dans `src/App.tsx`. Le site n’affiche pas de localisation.

Les polices Playfair Display et DM Sans sont chargées depuis Google Fonts ; les polices de secours système restent définies dans la feuille de style.

## Configurer Formspree

Le formulaire utilise l’identifiant public `xwloabln`, configuré dans `src/config/public.ts`. Il est inclus dans le frontend, comme l’exige Formspree ; ce n’est pas un secret. Pour le remplacer, modifiez `formspreeId` dans ce fichier. Vérifiez dans Formspree que le formulaire reçoit bien les messages à `hypolyteay@gmail.com`.

Le formulaire valide les champs dans le navigateur, inclut un champ honeypot, bloque un second clic pendant l’envoi et ne montre une confirmation qu’après une réponse HTTP positive.

## Déployer sur GitHub Pages

Le dépôt attendu est `hypolyteay-crypto/hypolyteportfolio`, servi à `https://hypolyteay-crypto.github.io/hypolyteportfolio/`. `vite.config.ts` définit déjà la base `/hypolyteportfolio/`.

1. Le dépôt existant `hypolyteportfolio` utilise la branche `main`.
2. Dans le dépôt, ouvrez **Settings → Pages**.
3. Sous **Build and deployment**, choisissez **GitHub Actions** comme source.
4. Chaque push sur `main` lance `.github/workflows/deploy.yml`. Suivez le résultat dans l’onglet **Actions**.
5. Une fois le workflow terminé, le site sera disponible à l’URL cible.

Pour utiliser un domaine personnalisé plus tard, configurez-le dans **Settings → Pages**, ajoutez les enregistrements DNS indiqués par GitHub et ajustez `base` dans `vite.config.ts` à `/` si le domaine sert le site à la racine. Les métadonnées de `index.html` et l’URL du sitemap devront alors être actualisées.

## Mettre le portfolio à jour

Modifiez les fichiers de contenu ou de style, vérifiez le résultat avec `npm run dev`, puis validez localement avec `npm run build`. Envoyez vos changements sur `main` : GitHub Actions reconstruira et publiera le site. Ne stockez aucun mot de passe ni jeton dans le dépôt.

