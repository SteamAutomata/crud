note à moi même, ne pas utiliser react router dans le futur

# Situation Professionnelle React CRUD

## Explication

Le projet contient un dossier `server` et un dossier `client` ainsi qu'un fichier `docker-compose.yml` pour les conteneurs.

J'utilise l'outil Express et Prisma pour le serveur, pour le client, c'est Vite React Router. Le tout en utilisant TypeScript.

## Installation

### Avec Docker Compose

C'est la manière la plus facile d'installer et d'avoir un projet fonctionnel. L'installation inclus un conteneur Vite, Express, PHPMyAdmin et MariaDB.

```
# docker compose up -d
```

### Manuel

Pour commencer, installer MariaDB, NodeJS, NPM puis exécuter `npm install` dans `server` et `client`.

Puis, ouvrir une console dans serveur et exécuter `npm run dev`.

Ouvrir une autre console dans client et exécuter `npm run dev`.

L'option `host` dans `client/vite.config.ts` est réglé à `0.0.0.0`, il est possible qu'il faut le changer à `127.0.0.1` ou le retirer complètement.
