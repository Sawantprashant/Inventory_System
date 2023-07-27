const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/inventory_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Load and use product router
const productRouter = require('./routes/productRoutes');
app.use('/api/products', productRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
