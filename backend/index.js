// backend/index.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

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

// ROUTE 2 : Produits en vedette (DOIT ÊTRE AVANT /:id)
app.get('/api/products/featured', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
    });
    res.json(products);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ROUTE 3 : Tous les produits
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
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


app.listen(PORT, () => {
  console.log(` API tourne sur http://localhost:${PORT}`);
});