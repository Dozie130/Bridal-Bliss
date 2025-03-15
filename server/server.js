const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dresses', require('./routes/dresses'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/payment', require('./routes/payment'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
