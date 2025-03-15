const mongoose = require('mongoose');

const dressSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    rentPrice: Number,
    images: [String],
    size: [String],
    style: String,
    designer: String,
    availability: Boolean,
    details: {
        material: String,
        length: String,
        embellishments: String
    }
});

module.exports = mongoose.model('Dress', dressSchema);
