const express = require('express');
const router = express.Router();
const Dress = require('../models/Dress');

router.get('/', async (req, res) => {
    const dresses = await Dress.find();
    res.json(dresses);
});

router.get('/:id', async (req, res) => {
    const dress = await Dress.findById(req.params.id);
    res.json(dress);
});

module.exports = router;
