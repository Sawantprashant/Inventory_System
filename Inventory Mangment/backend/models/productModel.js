const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inventory: { type: Number, default: 0 },
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
