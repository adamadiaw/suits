// backend/prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du remplissage de la base...\n');

  // ============================================
  // 1. CRÉER LES 3 BOUTIQUES
  // ============================================
  console.log('🏪 Création des boutiques...');

  const boutiques = [
    {
      name: 'Sac & Co',
      subdomain: 'luxe-bags',
      logo: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150&h=50&fit=crop',
    },
    {
      name: 'Chauss\'Style',
      subdomain: 'luxe-shoes',
      logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&h=50&fit=crop',
    },
    {
      name: 'Mode & Vous',
      subdomain: 'luxe-wear',
      logo: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=150&h=50&fit=crop',
    },
  ];

  const tenants = [];
  for (const boutique of boutiques) {
    const tenant = await prisma.tenant.create({
      data: boutique,
    });
    tenants.push(tenant);
    console.log(`   ✅ ${tenant.name} (${tenant.subdomain})`);
  }

  // ============================================
  // 2. CRÉER LES 3 ADMINS
  // ============================================
  console.log('\n👤 Création des administrateurs...');

  const admins = [
    {
      email: 'admin@luxebags.com',
      password: 'admin123',
      firstName: 'Sophie',
      lastName: 'Martin',
      tenantId: tenants[0].id,
    },
    {
      email: 'admin@luxeshoes.com',
      password: 'admin123',
      firstName: 'Thomas',
      lastName: 'Dubois',
      tenantId: tenants[1].id,
    },
    {
      email: 'admin@luxewear.com',
      password: 'admin123',
      firstName: 'Emma',
      lastName: 'Lefèvre',
      tenantId: tenants[2].id,
    },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const user = await prisma.user.create({
      data: {
        email: admin.email,
        password: hashedPassword,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'admin',
        tenantId: admin.tenantId,
      },
    });
    console.log(`   ✅ ${user.email} → ${user.firstName} ${user.lastName}`);
  }

  // ============================================
  // 3. AJOUTER DES PRODUITS POUR CHAQUE BOUTIQUE
  // ============================================

  // ----- 3.1 BOUTIQUE 1 : SAC & Co (sacs) -----
  console.log('\n👜 Ajout des produits pour Sac & Co...');

  const sacs = [
    {
      name: 'Sac à main en cuir noir',
      slug: 'sac-main-cuir-noir',
      description: 'Élégant sac à main en cuir véritable noir. Parfait pour toutes les occasions.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'],
      colors: ['Noir', 'Marron'],
      sizes: ['M', 'L'],
      gender: 'femme',
      isFeatured: true,
      rating: 4.8,
      tenantId: tenants[0].id,
    },
    {
      name: 'Sac à dos en toile beige',
      slug: 'sac-dos-toile-beige',
      description: 'Sac à dos tendance en toile beige. Idéal pour le quotidien.',
      price: 89.99,
      comparePrice: null,
      stock: 40,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
      colors: ['Beige', 'Kaki'],
      sizes: ['S', 'M', 'L'],
      gender: 'unisexe',
      isFeatured: true,
      rating: 4.5,
      tenantId: tenants[0].id,
    },
    {
      name: 'Sac bandoulière en cuir marron',
      slug: 'sac-bandouliere-cuir-marron',
      description: 'Sac bandoulière en cuir pleine fleur marron. Design intemporel.',
      price: 129.99,
      comparePrice: 159.99,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'],
      colors: ['Marron', 'Noir'],
      sizes: ['M'],
      gender: 'homme',
      isFeatured: false,
      rating: 4.7,
      tenantId: tenants[0].id,
    },
    {
      name: 'Sac à main rose poudré',
      slug: 'sac-main-rose-poudre',
      description: 'Joli sac à main rose poudré. Matière synthétique de haute qualité.',
      price: 69.99,
      comparePrice: 89.99,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop'],
      colors: ['Rose', 'Blanc'],
      sizes: ['S', 'M'],
      gender: 'femme',
      isFeatured: true,
      rating: 4.3,
      tenantId: tenants[0].id,
    },
  ];

  for (const sac of sacs) {
    await prisma.product.create({ data: sac });
  }
  console.log(`   ✅ ${sacs.length} sacs ajoutés`);

  // ----- 3.2 BOUTIQUE 2 : Chauss'Style (chaussures) -----
  console.log('\n👟 Ajout des produits pour Chauss\'Style...');

  const chaussures = [
    {
      name: 'Baskets blanches en cuir',
      slug: 'baskets-blanches-cuir',
      description: 'Baskets blanches en cuir pleine fleur. Un classique indémodable.',
      price: 79.99,
      comparePrice: 99.99,
      stock: 30,
      images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'],
      colors: ['Blanc', 'Noir'],
      sizes: ['38', '39', '40', '41', '42'],
      gender: 'unisexe',
      isFeatured: true,
      rating: 4.7,
      tenantId: tenants[1].id,
    },
    {
      name: 'Escarpins noirs à talon',
      slug: 'escarpins-noirs-talon',
      description: 'Escarpins noirs à talon aiguille. Élégance et sophistication.',
      price: 129.99,
      comparePrice: 159.99,
      stock: 15,
      images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop'],
      colors: ['Noir', 'Rouge'],
      sizes: ['36', '37', '38', '39'],
      gender: 'femme',
      isFeatured: true,
      rating: 4.9,
      tenantId: tenants[1].id,
    },
    {
      name: 'Mocassins en cuir marron',
      slug: 'mocassins-cuir-marron',
      description: 'Mocassins en cuir marron. Confort et style au quotidien.',
      price: 99.99,
      comparePrice: null,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=400&fit=crop'],
      colors: ['Marron', 'Noir'],
      sizes: ['39', '40', '41', '42', '43'],
      gender: 'homme',
      isFeatured: false,
      rating: 4.4,
      tenantId: tenants[1].id,
    },
    {
      name: 'Sandales en cuir beige',
      slug: 'sandales-cuir-beige',
      description: 'Sandales en cuir beige. Parfaites pour l\'été.',
      price: 59.99,
      comparePrice: 69.99,
      stock: 25,
      images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop'],
      colors: ['Beige', 'Blanc'],
      sizes: ['36', '37', '38', '39', '40'],
      gender: 'femme',
      isFeatured: false,
      rating: 4.2,
      tenantId: tenants[1].id,
    },
  ];

  for (const chaussure of chaussures) {
    await prisma.product.create({ data: chaussure });
  }
  console.log(`   ✅ ${chaussures.length} chaussures ajoutées`);

  // ----- 3.3 BOUTIQUE 3 : Mode & Vous (vêtements) -----
  console.log('\n👗 Ajout des produits pour Mode & Vous...');

  const vetements = [
    {
      name: 'Robe longue fleurie',
      slug: 'robe-longue-fleurie',
      description: 'Robe longue fleurie en coton léger. Parfaite pour les journées d\'été.',
      price: 89.99,
      comparePrice: 109.99,
      stock: 20,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop'],
      colors: ['Bleu', 'Rose'],
      sizes: ['S', 'M', 'L'],
      gender: 'femme',
      isFeatured: true,
      rating: 4.6,
      tenantId: tenants[2].id,
    },
    {
      name: 'Chemise blanche en lin',
      slug: 'chemise-blanche-lin',
      description: 'Chemise blanche en lin. Élégance et confort pour toute la journée.',
      price: 69.99,
      comparePrice: 89.99,
      stock: 35,
      images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=400&fit=crop'],
      colors: ['Blanc', 'Bleu'],
      sizes: ['S', 'M', 'L', 'XL'],
      gender: 'homme',
      isFeatured: false,
      rating: 4.5,
      tenantId: tenants[2].id,
    },
    {
      name: 'Pull en cachemire gris',
      slug: 'pull-cachemire-gris',
      description: 'Pull en cachemire gris. Douceur et chaleur pour l\'hiver.',
      price: 149.99,
      comparePrice: 199.99,
      stock: 12,
      images: ['https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400&h=400&fit=crop'],
      colors: ['Gris', 'Bordeaux'],
      sizes: ['S', 'M', 'L'],
      gender: 'unisexe',
      isFeatured: true,
      rating: 4.8,
      tenantId: tenants[2].id,
    },
    {
      name: 'Jupe midi en cuir noir',
      slug: 'jupe-midi-cuir-noir',
      description: 'Jupe midi en cuir noir. Tendance et féminine.',
      price: 119.99,
      comparePrice: 149.99,
      stock: 18,
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop'],
      colors: ['Noir', 'Marron'],
      sizes: ['S', 'M', 'L'],
      gender: 'femme',
      isFeatured: false,
      rating: 4.3,
      tenantId: tenants[2].id,
    },
  ];

  for (const vetement of vetements) {
    await prisma.product.create({ data: vetement });
  }
  console.log(`   ✅ ${vetements.length} vêtements ajoutés`);

  // ============================================
  // 4. RÉSUMÉ FINAL
  // ============================================
  console.log('\n📊 RÉSUMÉ');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🏪 3 boutiques créées`);
  console.log(`👤 3 administrateurs créés`);
  console.log(`👜 ${sacs.length} sacs`);
  console.log(`👟 ${chaussures.length} chaussures`);
  console.log(`👗 ${vetements.length} vêtements`);
  console.log('\n🔑 Accès admin :');
  console.log('   admin@luxebags.com / admin123 → Sac & Co');
  console.log('   admin@luxeshoes.com / admin123 → Chauss\'Style');
  console.log('   admin@luxewear.com / admin123 → Mode & Vous');
  console.log('\n🎉 Remplissage terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });