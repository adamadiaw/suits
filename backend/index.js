// backend/index.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { authenticate, isAdmin } = require('./middleware/auth');

dotenv.config();

// Créer le client Prisma (pour parler à la base)
const prisma = new PrismaClient();

// Créer l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----- ROUTES -----

// ROUTE 1 : Test
app.get('/api/hello', (req, res) => {
  res.json({ message: 'API fonctionne ! ✅' });
});

// Route : Récupérer les produits d'une boutique spécifique
app.get('/api/products', async (req, res) => {
  try {
    const { tenantId } = req.query;

    let whereClause = {};
    
    if (tenantId) {
      // Si un tenantId est passé, filtrer par cette boutique
      whereClause = { tenantId: tenantId };
    } else {
      // Sinon, prendre la première boutique (par défaut)
      const defaultTenant = await prisma.tenant.findFirst();
      if (defaultTenant) {
        whereClause = { tenantId: defaultTenant.id };
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        tenant: true,
      },
    });
    
    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Produits en vedette d'une boutique
app.get('/api/products/featured', async (req, res) => {
  try {
    const { tenantId } = req.query;

    let whereClause = { isFeatured: true };
    
    if (tenantId) {
      whereClause = { ...whereClause, tenantId: tenantId };
    } else {
      const defaultTenant = await prisma.tenant.findFirst();
      if (defaultTenant) {
        whereClause = { ...whereClause, tenantId: defaultTenant.id };
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        tenant: true,
      },
    });
    
    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE 4 : Produit par ID (DOIT ÊTRE EN DERNIER)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Créer une commande
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customer, userId } = req.body;

    // 1. Récupérer le tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return res.status(400).json({ error: 'Aucune boutique trouvée' });
    }

    // 2. Gérer l'utilisateur
    let user;

    if (userId) {
      // Si userId est fourni, on utilise cet utilisateur
      user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
      }
    } else {
      // Si pas de userId, on cherche par email ou on crée un compte
      user = await prisma.user.findUnique({
        where: { email: customer.email }
      });

      if (!user) {
        // Créer un compte sans mot de passe (guest)
        user = await prisma.user.create({
          data: {
            email: customer.email,
            password: 'guest_' + Date.now(), // Mot de passe temporaire
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone || '',
            address: customer.address,
            city: customer.city,
            role: 'customer',
            tenantId: tenant.id,
          },
        });
      }
    }

    // 3. Générer un numéro de commande
    const orderNumber = 'CMD-' + Date.now().toString().slice(-8);

    // 4. Créer la commande
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        total: total,
        subtotal: total,
        tax: 0,
        shipping: 0,
        status: 'pending',
        userId: user.id,
        tenantId: tenant.id,
        address: JSON.stringify({
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
          country: customer.country,
        }),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
            color: item.color || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log(`✅ Commande ${orderNumber} créée pour ${user.email}`);

    res.status(201).json({
      success: true,
      order: order,
      message: `Commande ${orderNumber} créée avec succès`,
    });

  } catch (error) {
    console.error('Erreur création commande:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// Route : Récupérer les commandes d'un utilisateur
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(orders);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

app.listen(PORT, () => {
  console.log(` API tourne sur http://localhost:${PORT}`);
});


// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================

// ROUTE 1 : Inscription
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1. Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // 2. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Récupérer le tenant (boutique)
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      return res.status(400).json({ error: 'Aucune boutique trouvée' });
    }

    // 4. Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        role: 'customer',
        tenantId: tenant.id,
      },
    });

    // 5. Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Renvoyer les infos (sans le mot de passe)
    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// ROUTE 2 : Connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // 2. Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // 3. Créer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Renvoyer les infos
    res.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// ============================================
// ROUTES ADMIN - PROTÉGÉES
// ============================================

// Route : Récupérer les produits de la boutique de l'admin
app.get('/api/admin/products', authenticate, isAdmin, async (req, res) => {
  try {
    // Récupérer l'admin et sa boutique
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    console.log('🔍 Admin connecté:', admin?.email);
    console.log('🏪 Tenant ID:', admin?.tenantId);

    if (!admin || !admin.tenantId) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    const products = await prisma.product.findMany({
      where: { 
        tenantId: admin.tenantId 
      },
      include: {
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📦 ${products.length} produits trouvés pour la boutique`);

    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Créer un produit (dans la boutique de l'admin)
app.post('/api/admin/products', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, comparePrice, stock, images, colors, sizes, gender, isFeatured } = req.body;

    // Récupérer l'admin et sa boutique
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!admin || !admin.tenantId) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        images: images || [],
        colors: colors || [],
        sizes: sizes || [],
        gender: gender || 'unisexe',
        isFeatured: isFeatured || false,
        tenantId: admin.tenantId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// Route : Modifier un produit
app.put('/api/admin/products/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, comparePrice, stock, images, colors, sizes, gender, isFeatured } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        stock: parseInt(stock),
        images: images || [],
        colors: colors || [],
        sizes: sizes || [],
        gender: gender || 'unisexe',
        isFeatured: isFeatured || false,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la modification' });
  }
});

// Route : Supprimer un produit
app.delete('/api/admin/products/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Route : Récupérer toutes les commandes (admin)
app.get('/api/admin/orders', authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(orders);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Modifier le statut d'une commande
app.put('/api/admin/orders/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Route : Statistiques (admin)
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    const totalUsers = await prisma.user.count();

    // Calcul du chiffre d'affaires
    const orders = await prisma.order.findMany({
      where: { status: { not: 'cancelled' } },
    });
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      revenue,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Récupérer les produits de la boutique de l'admin
app.get('/api/admin/products', authenticate, isAdmin, async (req, res) => {
  try {
    // Récupérer l'admin et sa boutique
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!admin || !admin.tenantId) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    const products = await prisma.product.findMany({
      where: { tenantId: admin.tenantId },
      include: {
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Créer une boutique
app.post('/api/admin/tenants', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, subdomain, logo } = req.body;

    const tenant = await prisma.tenant.create({
      data: {
        name,
        subdomain,
        logo: logo || '',
      },
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// Route : Récupérer une boutique par sous-domaine (pour le frontend)
app.get('/api/tenants/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: {
        products: true,
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Boutique non trouvée' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route : Récupérer toutes les boutiques
app.get('/api/tenants', async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json(tenants);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});