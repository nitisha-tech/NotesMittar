
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
const dotenv = require('dotenv');
const authRoutes  = require('./routes/authRoutes.cjs'); // your login/signup logic
const resourceRoutes = require('./routes/resourceRoutes.cjs'); // for viewing resources

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);           // handles /api/auth/login and /api/auth/signup
app.use("/api/resources", resourceRoutes);  // handles /api/resources

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});