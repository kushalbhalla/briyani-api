const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    desc: {
        type: String,
        max: 255,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);