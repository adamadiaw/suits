// backend/prisma/seed-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Création d\'un admin pour Olivia Mathis...');

  // 1. Récupérer ou créer la boutique "Olivia Mathis"
  let tenant = await prisma.tenant.findUnique({
    where: { subdomain: 'olivia-mathis' }
  });

  if (!tenant) {
    console.log('📝 Création de la boutique...');
    
    tenant = await prisma.tenant.create({
      data: {
        name: 'Olivia Mathis',
        subdomain: 'olivia-mathis',
        logo: 'https://via.placeholder.com/150x50/FF69B4/fff?text=Olivia+Mathis',
      },
    });
    console.log(`✅ Boutique créée : ${tenant.name}`);
  } else {
    console.log(`✅ Boutique trouvée : ${tenant.name}`);
  }

  // 2. Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'olivia@mathis.com' }
  });

  if (existingAdmin) {
    console.log('⚠️ Un admin existe déjà pour cette boutique');
    console.log(`📧 Email: ${existingAdmin.email}`);
    return;
  }

  // 3. Créer l'admin
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'olivia@mathis.com',
      password: hashedPassword,
      firstName: 'Olivia',
      lastName: 'Mathis',
      role: 'admin',
      tenantId: tenant.id,
    },
  });

  console.log(`✅ Admin créé : ${admin.email}`);
  console.log(`🔑 Mot de passe : admin123`);
  console.log(`🏪 Boutique : ${tenant.name}`);
  console.log('');
  console.log('📋 Pour te connecter :');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Mot de passe: admin123`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });