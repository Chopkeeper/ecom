const mongoose = require('mongoose');

// --- Product Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  category: { type: String, required: true },
  image: { type: String }, // Primary Thumbnail
  images: [{ type: String }], // Array of image URLs
  stock: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// --- User Schema ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed in real app
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- Order Schema ---
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    discountPercent: Number,
    shippingCost: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'verified', 'shipped'], 
    default: 'pending' 
  },
  paymentMethod: { type: String, default: 'promptpay' },
  slipImage: { type: String } // URL to uploaded slip
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = { Product, User, Order };