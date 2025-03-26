
# Forum React CRUD

Un forum très très simple avec des éléments de CRUD.


## Explication

Le projet contient un dossier `server` et un dossier `client` ainsi qu'un fichier `docker-compose.yml` pour les conteneurs.

J'utilise l'outil Express et Prisma pour le serveur, pour le client, c'est Vite React Router. Le tout en utilisant TypeScript.

Il y a un système d'authentification JWT mais celui-ci n'est pas fonctionnel en raison de contraintes de temps.

## Installation

### Avec Docker Compose

C'est la manière la plus facile d'installer et d'avoir un projet fonctionnel. L'installation inclus un conteneur Vite, Express, PHPMyAdmin et MariaDB.

```
# docker compose up -d
```

Seed la base de données:
```
$ cd server
$ npx prisma db push
$ npx prisma db seed
```

### Manuel

Pour commencer, installer MariaDB, NodeJS, NPM puis exécuter `npm install` dans `server` et `client`.

Puis, ouvrir une console dans serveur et exécuter `npm run dev`.

Ouvrir une autre console dans client et exécuter `npm run dev`.

L'option `host` dans `client/vite.config.ts` est réglé à `0.0.0.0`, il est possible qu'il faut le changer à `127.0.0.1` ou le retirer complètement.


## Structure

client/ -> Vite
├─ app/
│  ├─ components/
│  ├─ routes/
│  │  ├─ posts.tsx -> Fil d'actualité
│  │  ├─ home.tsx -> Page d'accueil
│  │  ├─ users.tsx -> Gestion des utilisateurs
│  ├─ routes.ts -> Définition des routes
│  ├─ utils.ts -> Fonctions passe-partout
│  ├─ root.tsx/ -> Racine de l'application

server/ -> Express
├─ db/
│  ├─ schema.prisma -> Schéma ORM de la BDD
│  ├─ seed.ts -> Ecrire des valeurs de test dans la BDD
├─ handlers/ -> Principaux interactions avec la BDD
├─ globals.ts -> Besoin d'accéder à ces valeurs dans la plupart des modules
├─ main.ts -> Code principal
