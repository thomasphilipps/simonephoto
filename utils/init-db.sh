#!/usr/bin/env bash

##
# Script pour initialiser la base MongoDB via Docker.
##

# 1) Déterminer le fichier .env à charger (par défaut .env)
ENV_FILE=${1:-.env}

# 2) Charger les variables d'environnement
set -a
source "$ENV_FILE"
set +a

# 3) Vérification des variables essentielles
if [[ -z "$MONGO_DB_NAME" || -z "$MONGO_USER" || -z "$MONGO_PASSWORD" || -z "$MONGO_ROOT_USER" || -z "$MONGO_ROOT_PASSWORD" ]]; then
  echo "❌ Erreur : certaines variables d'environnement MongoDB ne sont pas définies."
  exit 1
fi

# 4) Création du fichier de script MongoDB
cat <<EOF > init.js
const dbName = '${MONGO_DB_NAME}';
const user   = '${MONGO_USER}';
const pass   = '${MONGO_PASSWORD}';

db = db.getSiblingDB(dbName);

const collections = ["galleries", "categories", "pictures", "users", "reviews"];
collections.forEach(col => {
  if (!db.getCollectionNames().includes(col)) {
    db.createCollection(col);
    print(\`Collection \${col} créée.\`);
  }
});

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

# 5) Vérifier que MongoDB est bien en cours d'exécution
if ! docker compose ps | grep -q mongodb; then
  echo "❌ MongoDB ne semble pas être démarré. Lancement..."
  docker compose up -d mongodb
  sleep 5  # Attente pour que MongoDB démarre correctement
fi

# 6) Vérifier la connexion à MongoDB
if ! docker compose exec -it mongodb mongosh -u "$MONGO_ROOT_USER" -p "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin --eval "db.runCommand({ connectionStatus: 1 })"; then
  echo "❌ Échec de connexion à MongoDB. Vérifiez les logs avec 'docker compose logs mongodb'."
  exit 1
fi

# 7) Copie du script dans le conteneur
docker cp init.js $(docker compose ps -q mongodb):/init.js

# 8) Exécution du script dans MongoDB
docker compose exec -it mongodb mongosh \
    -u "${MONGO_ROOT_USER}" \
    -p "${MONGO_ROOT_PASSWORD}" \
    --authenticationDatabase admin \
    /init.js

# 9) Nettoyage du fichier temporaire
rm init.js

echo "✅ Initialisation de la base MongoDB terminée."
