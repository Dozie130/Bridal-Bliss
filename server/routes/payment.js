const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/create-checkout-session', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).populate('cart.dressId');
    const lineItems = user.cart.map(item => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.dressId.name,
            },
            unit_amount: item.forRent ? item.dressId.rentPrice * 100 : item.dressId.price * 100,
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ id: session.id });
});

module.exports = router;
