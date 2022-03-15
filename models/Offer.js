const mongoose  = require('mongoose');

const offerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        offPrice: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Offers', offerSchema);