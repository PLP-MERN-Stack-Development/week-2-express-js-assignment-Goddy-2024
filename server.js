// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res)=>{
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);
  if(product){
    res.json(product);
  }else{
    res.status(404).json({error: 'product not found'})
    }

});

// POST /api/products - Create a new product
app.post('/api/products', (req, res)=>{
  const newProduct = {
    id: uuidv4(), // Generate a unique ID for the new product
    ...req.body // Spread the request body to include all product details
  }
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex !== -1) {
    const updatedProduct = {
      ...products[productIndex],
      ...req.body // Update the product with the new data
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex !== -1) {
    products.splice(productIndex, 1); // Remove the product from the array
    res.status(204).send(); // No content response
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling
// Create product (with auth & error handling)
app.post('/api/products', authenticate, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    if (!name || typeof price !== 'number') {
      return res.status(400).json({ message: 'Invalid product data' });
    }
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error); // Forward error to middleware
  }
});
// Custom middleware for request logging
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 