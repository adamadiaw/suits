// backend/prisma/seed.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du remplissage de la base...');

  // 1. Créer une boutique (Tenant)
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Luxe Bags',
      subdomain: 'luxe-bags',
      logo: 'https://via.placeholder.com/150x50/000/fff?text=LUXE+BAGS',
    },
  });
  console.log(`✅ Boutique créée : ${tenant.name}`);

  // 2. Créer les produits (Sacs)
 // backend/prisma/seed.js
// Dans la partie products, remplace images: [] par :

const products = [
  {
    name: 'Sac à main en cuir noir',
    slug: 'sac-main-cuir-noir',
    description: 'Élégant sac à main en cuir véritable noir. Parfait pour toutes les occasions.',
    price: 149.99,
    comparePrice: 199.99,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop'
    ],
    colors: ['Noir', 'Marron'],
    sizes: ['M', 'L'],
    gender: 'femme',
    isFeatured: true,
    rating: 4.8,
    tenantId: tenant.id,
  },
  {
    name: 'Sac à dos en toile beige',
    slug: 'sac-dos-toile-beige',
    description: 'Sac à dos tendance en toile beige. Idéal pour le quotidien ou les voyages.',
    price: 89.99,
    comparePrice: null,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'
    ],
    colors: ['Beige', 'Kaki'],
    sizes: ['S', 'M', 'L'],
    gender: 'unisexe',
    isFeatured: true,
    rating: 4.5,
    tenantId: tenant.id,
  },
  {
    name: 'Sac bandoulière en cuir marron',
    slug: 'sac-bandouliere-cuir-marron',
    description: 'Sac bandoulière en cuir pleine fleur marron. Design intemporel et élégant.',
    price: 129.99,
    comparePrice: 159.99,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop'
    ],
    colors: ['Marron', 'Noir'],
    sizes: ['M'],
    gender: 'homme',
    isFeatured: false,
    rating: 4.7,
    tenantId: tenant.id,
  },
  {
    name: 'Sac à main rose poudré',
    slug: 'sac-main-rose-poudre',
    description: 'Joli sac à main rose poudré. Matière synthétique de haute qualité.',
    price: 69.99,
    comparePrice: 89.99,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    ],
    colors: ['Rose', 'Blanc'],
    sizes: ['S', 'M'],
    gender: 'femme',
    isFeatured: true,
    rating: 4.3,
    tenantId: tenant.id,
  },
  {
    name: 'Sac de voyage en toile noire',
    slug: 'sac-voyage-toile-noire',
    description: 'Grand sac de voyage en toile noire résistante. Parfait pour le week-end.',
    price: 79.99,
    comparePrice: null,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'
    ],
    colors: ['Noir', 'Gris'],
    sizes: ['L', 'XL'],
    gender: 'unisexe',
    isFeatured: false,
    rating: 4.6,
    tenantId: tenant.id,
  },
  {
    name: 'Sac crocodile vert émeraude',
    slug: 'sac-crocodile-vert-emeraude',
    description: 'Sac luxueux en simili-crocodile vert émeraude. Pour les occasions spéciales.',
    price: 199.99,
    comparePrice: 249.99,
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    ],
    colors: ['Vert', 'Or'],
    sizes: ['M'],
    gender: 'femme',
    isFeatured: true,
    rating: 4.9,
    tenantId: tenant.id,
  },
  {
    name: 'Sac messenger en toile grise',
    slug: 'sac-messenger-toile-grise',
    description: 'Sac messenger moderne en toile grise. Poche ordinateur 15 pouces.',
    price: 59.99,
    comparePrice: 69.99,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop'
    ],
    colors: ['Gris', 'Noir'],
    sizes: ['M', 'L'],
    gender: 'homme',
    isFeatured: false,
    rating: 4.4,
    tenantId: tenant.id,
  },
  {
    name: 'Sac à main bordeaux',
    slug: 'sac-main-bordeaux',
    description: 'Sac à main élégant couleur bordeaux. Cuir lisse et doublure intérieure en microfibre.',
    price: 159.99,
    comparePrice: 189.99,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
    ],
    colors: ['Bordeaux', 'Noir'],
    sizes: ['M', 'L'],
    gender: 'femme',
    isFeatured: true,
    rating: 4.7,
    tenantId: tenant.id,
  },
];

  // 3. Insérer tous les produits
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log(`✅ ${products.length} produits créés !`);

  // 4. Créer un utilisateur admin (mot de passe: admin123)
  // Pour simplifier, on va utiliser un mot de passe en clair pour l'instant
  // (plus tard on utilisera bcrypt)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@luxebags.com',
      password: 'admin123', // ⚠️ TEMPORAIRE - on hash plus tard
      firstName: 'Admin',
      lastName: 'Luxe Bags',
      role: 'admin',
      tenantId: tenant.id,
    },
  });
  console.log(`✅ Admin créé : ${admin.email}`);

  console.log('🎉 Remplissage terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });