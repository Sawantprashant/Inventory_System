const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// API endpoint to get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products from the database' });
  }
});

// API endpoint to add a new product
router.post('/addprod', async (req, res) => {
  const { name, inventory } = req.body;
  if (!name || isNaN(inventory)) {
    res.status(400).json({ error: 'Invalid input data' });
    return;
  }

  try {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      res.status(409).json({ error: 'Product already exists' });
      return;
    }

    const newProduct = new Product({ name, inventory });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product to the database' });
  }
});

// API endpoint to update the inventory of a product
router.put('/update/:productId', async (req, res) => {
  const { productId } = req.params;
  const { inventory } = req.body;

  if (isNaN(inventory)) {
    res.status(400).json({ error: 'Invalid inventory value' });
    return;
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    product.inventory = inventory;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product in the database' });
  }
});

module.exports = router;
