const mongoose = require('mongoose');

export const priceSchema = mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    symbol1: String,
    symbol2: String,
    price: Number,
    open24: Number
})

