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

app.get('/api/hello', (req, res) => {
  res.json({ message: 'API fonctionne ! ✅' });
});

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
// ROUTES AUTH
// ============================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, tenantId } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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
// ROUTES ORDERS
// ============================================

app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customer, userId, tenantId } = req.body;

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

    let user;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(400).json({ error: 'Utilisateur non trouvé' });
      }
      
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
        user = await prisma.user.update({
          where: { id: user.id },
          data: { tenantId: tenant.id }
        });
      }
    }

    const orderNumber = 'CMD-' + Date.now().toString().slice(-8);

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
// ROUTES REVIEWS
// ============================================

app.get('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: avgRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des avis' });
  }
});

app.post('/api/products/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, userId, tenantId } = req.body;

    console.log('📝 Nouvel avis:', { productId, rating, comment, userId, tenantId });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non connecté' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment: comment || '',
        userId: userId,
        productId: productId,
        tenantId: tenantId || product.tenantId,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const allReviews = await prisma.review.findMany({
      where: { productId },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: avgRating,
        reviewsCount: allReviews.length,
      },
    });

    console.log('✅ Avis créé:', review.id);
    res.status(201).json(review);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'avis', details: error.message });
  }
});

app.delete('/api/admin/reviews/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.delete({
      where: { id },
    });

    const allReviews = await prisma.review.findMany({
      where: { productId: review.productId },
    });

    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: avgRating,
        reviewsCount: allReviews.length,
      },
    });

    res.json({ success: true, message: 'Avis supprimé' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ============================================
// ROUTES ADMIN
// ============================================

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
// DÉMARRAGE
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 API tourne sur http://localhost:${PORT}`);
});