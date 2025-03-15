const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [{
        dressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dress' },
        quantity: { type: Number, default: 1 },
        forRent: { type: Boolean, default: false }
    }]
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
