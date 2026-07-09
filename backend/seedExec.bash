# Dans le dossier backend
cd backend

# Vérifier que le .env a la bonne URL
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Exécuter les migrations
npx prisma migrate dev --name init

# Générer le client
npx prisma generate

# Remplir les données
npm run seed