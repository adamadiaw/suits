// backend/prisma/seed-olivia-products.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('👜 Ajout de produits pour Olivia Mathis...');

  // Récupérer la boutique
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain: 'olivia-mathis' }
  });

  if (!tenant) {
    console.log('❌ Boutique "Olivia Mathis" non trouvée');
    return;
  }

  const products = [
    {
      name: 'Sac à main fleuri printemps',
      slug: 'sac-fleuri-printemps',
      description: 'Sac à main fleuri aux couleurs du printemps. Parfait pour les beaux jours.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop'],
      colors: ['Rose', 'Jaune'],
      sizes: ['M'],
      gender: 'femme',
      isFeatured: true,
      rating: 4.7,
      tenantId: tenant.id,
    },
    {
      name: 'Sac à dos minimaliste blanc',
      slug: 'sac-minimaliste-blanc',
      description: 'Sac à dos minimaliste en toile blanche. Un style épuré et moderne.',
      price: 65.00,
      comparePrice: null,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
      colors: ['Blanc', 'Gris'],
      sizes: ['S', 'M'],
      gender: 'unisexe',
      isFeatured: false,
      rating: 4.4,
      tenantId: tenant.id,
    },
    {
      name: 'Sac à main paillettes doré',
      slug: 'sac-paillettes-dore',
      description: 'Sac à main pailleté doré pour les soirées. Luxe et élégance assurés.',
      price: 120.00,
      comparePrice: 149.99,
      stock: 8,
      images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop'],
      colors: ['Doré', 'Argent'],
      sizes: ['S'],
      gender: 'femme',
      isFeatured: true,
      rating: 4.9,
      tenantId: tenant.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ ${products.length} produits ajoutés pour ${tenant.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });