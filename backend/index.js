// backend/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { authenticate, isAdmin } = require('./middleware/auth');

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ============================================
// ROUTES PUBLIQUES
// ============================================

// ROUTE : Test
app.get('/api/hello', (req, res) => {
  res.json({ message: 'API fonctionne ! ✅' });
});

// ROUTE : Récupérer les produits d'une boutique
app.get('/api/products', async (req, res) => {
  try {
    const { tenantId } = req.query;

    let whereClause = {};
    
    if (tenantId) {
      whereClause = { tenantId: tenantId };
    } else {
      const defaultTenant = await prisma.tenant.findFirst();
      if (defaultTenant) {
        whereClause = { tenantId: defaultTenant.id };
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { tenant: true },
    });
    
    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE : Produits en vedette
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
      include: { tenant: true },
    });
    
    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE : Produit par ID
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

// ROUTE : Récupérer toutes les boutiques (public)
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

// ROUTE : Récupérer une boutique par sous-domaine
app.get('/api/tenants/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      include: { products: true },
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

// ============================================
// ROUTES D'AUTHENTIFICATION
// ============================================

// ROUTE : Inscription (CORRIGÉE)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, tenantId } = req.body;

    // 1. Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // 2. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Récupérer le tenant
    let tenant;
    if (tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    }
    if (!tenant) {
      tenant = await prisma.tenant.findFirst();
    }
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

// ROUTE : Connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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
// ROUTES COMMANDES
// ============================================

// ROUTE : Créer une commande (CORRIGÉE)
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customer, userId, tenantId } = req.body;

    // 1. Récupérer le tenant
    let tenant;
    if (tenantId) {
      tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    }
    if (!tenant) {
      tenant = await prisma.tenant.findFirst();
    }
    if (!tenant) {
      return res.status(400).json({ error: 'Aucune boutique trouvée' });
    }

    // 2. Gérer l'utilisateur
    let user;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
      }
      
      // 👇 CORRECTION : Si l'utilisateur n'a pas de tenantId, on le met à jour
      if (!user.tenantId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { tenantId: tenant.id }
        });
      }
    } else {
      user = await prisma.user.findUnique({
        where: { email: customer.email }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: customer.email,
            password: 'guest_' + Date.now(),
            firstName: customer.firstName,
            lastName: customer.lastName,
            phone: customer.phone || '',
            address: customer.address,
            city: customer.city,
            role: 'customer',
            tenantId: tenant.id,
          },
        });
      } else if (!user.tenantId) {
        // Si l'utilisateur existe mais n'a pas de tenantId
        user = await prisma.user.update({
          where: { id: user.id },
          data: { tenantId: tenant.id }
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
      include: { items: true },
    });

    console.log(`✅ Commande ${orderNumber} créée pour ${user.email} (${tenant.name})`);

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

// ROUTE : Récupérer les commandes d'un utilisateur
app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: { include: { product: true } },
        tenant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// ============================================
// ROUTES ADMIN - PROTÉGÉES
// ============================================

// ROUTE : Récupérer les produits de la boutique de l'admin
app.get('/api/admin/products', authenticate, isAdmin, async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!admin || !admin.tenantId) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    const products = await prisma.product.findMany({
      where: { tenantId: admin.tenantId },
      include: { tenant: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE : Créer un produit
app.post('/api/admin/products', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, comparePrice, stock, images, colors, sizes, gender, isFeatured } = req.body;

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

// ROUTE : Modifier un produit
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

// ROUTE : Supprimer un produit
app.delete('/api/admin/products/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.json({ success: true, message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ROUTE : Récupérer les commandes de la boutique de l'admin
app.get('/api/admin/orders', authenticate, isAdmin, async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!admin || !admin.tenantId) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    const orders = await prisma.order.findMany({
      where: { tenantId: admin.tenantId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE : Modifier le statut d'une commande
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

// ROUTE : Statistiques de la boutique de l'admin
app.get('/api/admin/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { tenant: true }
    });

    if (!admin || !admin.tenantId) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    const tenantId = admin.tenantId;

    const totalProducts = await prisma.product.count({ where: { tenantId } });
    const totalOrders = await prisma.order.count({ where: { tenantId } });
    const totalUsers = await prisma.user.count({ where: { tenantId } });

    const orders = await prisma.order.findMany({
      where: { tenantId, status: { not: 'cancelled' } }
    });
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({ totalProducts, totalOrders, totalUsers, revenue });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE : Récupérer LA boutique de l'admin
app.get('/api/admin/tenants', authenticate, isAdmin, async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { 
        tenant: {
          include: { _count: { select: { products: true } } }
        }
      }
    });

    if (!admin || !admin.tenant) {
      return res.status(400).json({ error: 'Admin sans boutique' });
    }

    res.json([admin.tenant]);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE : Créer une boutique (admin)
app.post('/api/admin/tenants', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, subdomain, logo } = req.body;

    const tenant = await prisma.tenant.create({
      data: { name, subdomain, logo: logo || '' },
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 API tourne sur http://localhost:${PORT}`);
});