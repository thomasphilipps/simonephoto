#!/usr/bin/env bash

##
# Script pour initialiser la base MongoDB via Docker.
# Usage:
#   ./init-db.sh              # charge les vars depuis .env par défaut
#   ./init-db.sh .env.local   # charge les vars depuis .env.local
##

# 1) Déterminer le fichier .env à charger (par défaut .env)
ENV_FILE=${1:-.env}

# 2) Exporter les variables du .env
set -a
source "$ENV_FILE"
set +a

# 3) Créer un fichier JS temporaire avec nos commandes mongosh
cat <<EOF > init.js
// On récupère le nom de la DB, l'user et le password à partir des variables d'env
const dbName = '${MONGO_DB_NAME}';
const user   = '${MONGO_USER}';
const pass   = '${MONGO_PASSWORD}';

// Sélection de la DB
db = db.getSiblingDB(dbName);

// Création des collections si elles n'existent pas déjà
const collections = ["galleries", "categories", "pictures", "users"];
collections.forEach(col => {
  if (!db.getCollectionNames().includes(col)) {
    db.createCollection(col);
    print(\`Collection \${col} créée.\`);
  }
});

// Création de l'utilisateur avec rôle readWrite sur la DB
try {
  db.createUser({
    user: user,
    pwd: pass,
    roles: [
      { role: "readWrite", db: dbName }
    ]
  });
  print(\`Utilisateur \${user} créé.\`);
} catch (err) {
  print("Erreur ou utilisateur déjà existant : " + err);
}
EOF

# Copie du fichier dans le conteneur "mongodb" (à la racine par ex.)
docker compose cp init.js mongodb:/init.js

# 4) Lancement de mongosh dans le container Docker
#    On utilise -it pour avoir le prompt intercatif et saisir le password root.
docker compose exec -it mongodb mongosh \
    -u "${MONGO_ROOT_USER}" \
    -p \
    --authenticationDatabase admin \
    init.js

# 5) Nettoyage du fichier temporaire (optionnel)
rm init.js
