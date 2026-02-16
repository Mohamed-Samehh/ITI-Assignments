const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        minLength: 5,
        maxLength: 20,
        trim: true
    },
    categories: {
        type: [String],
        default: ['General']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 0
    }
}, {
    timestamps: true
});

productsSchema.index({ owner: 1, name: 1 }, { unique: true });

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
