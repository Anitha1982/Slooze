// ===============================
// server.js
// ===============================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT ||4000;

// Middleware
app.use(cors({
  origin: 'https://commodities-api.netlify.app', // frontend served by same server
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

//  USERS list:
const USERS = [
  { id: 1, email: 'manager@example.com', password: 'manager123', role: 'manager' },
  { id: 2, email: 'store@example.com', password: 'store123', role: 'storekeeper' }
];


// In-memory session store
const sessions = {};

// ===============================
// LOGIN
// ===============================
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = `token_${user.id}_${Date.now()}`;
  sessions[token] = { userId: user.id, role: user.role };

  res.cookie('session_token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false // set to true if using HTTPS
  });

  res.json({ message: 'Login successful', role: user.role });
});

// ===============================
// SESSION CHECK
// ===============================
app.get('/auth/session', (req, res) => {
  const token = req.cookies.session_token;
  if (!token || !sessions[token]) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const session = sessions[token];
  const user = USERS.find(u => u.id === session.userId);
  res.json({ email: user.email, role: user.role });
});

// ===============================
// LOGOUT
// ===============================
app.post('/auth/logout', (req, res) => {
  const token = req.cookies.session_token;
  if (token) delete sessions[token];
  res.clearCookie('session_token');
  res.json({ message: 'Logged out' });
});

// ===============================
// PRODUCT MANAGEMENT
// ===============================
let PRODUCTS = [
  { id: 1, name: 'Rice', category: 'Grain', price: 60 },
  { id: 2, name: 'Sugar', category: 'Sweetener', price: 45 },
  { id: 3, name: 'Wheat', category: 'Grain', price: 50 }
];

// Middleware to verify session before product routes
function authenticate(req, res, next) {
  const token = req.cookies.session_token;
  if (!token || !sessions[token]) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.session = sessions[token];
  next();
}

// Helper to check role
function authorize(allowedRoles) {
  return (req, res, next) => {
    const role = req.session.role;
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
}

// GET /products - fetch all
app.get('/products', authenticate, authorize(['manager', 'storekeeper']), (req, res) => {
  res.json(PRODUCTS);
});

// POST - Add product (both roles)
app.post('/products', authenticate, authorize(['manager', 'storekeeper']), (req, res) => {
  const { name, price, category } = req.body;
  const newProduct = { id: PRODUCTS.length + 1, name, price, category };
  PRODUCTS.push(newProduct);
  res.json({ message: 'Product added successfully', product: newProduct });
});

// PUT - Edit product (both roles)
app.put('/products/:id', authenticate, authorize(['manager', 'storekeeper']), (req, res) => {
  const product = PRODUCTS.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  Object.assign(product, req.body);
  res.json({ message: 'Product updated successfully', product });
});


// ===============================
// DASHBOARD DATA (role-based access)
// ===============================
app.get('/dashboard/data', authenticate, authorize(['manager']), (req, res) => {
  const totalProducts = PRODUCTS.length;
  const totalValue = PRODUCTS.reduce((sum, p) => sum + p.price, 0);
  const estimatedProfit = totalValue * 0.2; // assume 20% profit margin

  const stats = {
    products: totalProducts,
    profit: `₹${estimatedProfit.toFixed(2)}`
  };

  const insights = `You have ${totalProducts} products. Estimated profit: ${stats.profit}`;

  res.json({ stats, insights });
});


// ===============================
// FALLBACK - for any unknown route
// ===============================
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
