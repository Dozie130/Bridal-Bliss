const express = require('express');
const router = express.Router();
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

router.get('/', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).populate('cart.dressId');
    res.json(user.cart);
});

router.post('/add', authMiddleware, async (req, res) => {
    const { dressId, quantity, forRent } = req.body;
    const user = await User.findById(req.user.id);
    const itemIndex = user.cart.findIndex(item => item.dressId.toString() === dressId);
    
    if (itemIndex > -1) {
        user.cart[itemIndex].quantity += quantity;
    } else {
        user.cart.push({ dressId, quantity, forRent });
    }
    await user.save();
    res.json(user.cart);
});

router.delete('/remove/:dressId', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.dressId.toString() !== req.params.dressId);
    await user.save();
    res.json(user.cart);
});

module.exports = router;
