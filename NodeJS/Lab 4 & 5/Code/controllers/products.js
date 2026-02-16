const CustomError = require('../helpers/CustomError');
const { Products } = require('../models');

const create = async (data) => {
    const product = await Products.create(data);
    const productJson = product.toJSON();

    let status = 'out of stock';
    if (product.quantity > 2)
        status = 'available';
    else if (product.quantity > 0)
        status = 'low stock';

    return {
        ...productJson,
        status
    };
};

const updateById = async ({ id, ownerId, data }) => {
    const product = await Products.findOneAndUpdate(
        { _id: id, owner: ownerId },
        data,
        { new: true, runValidators: true }
    ).exec();

    if (!product) {
        throw new CustomError({ statusCode: 404, code: 'NOT_FOUND', message: 'Product not found' });
    }

    const productJson = product.toJSON();

    let status = 'out of stock';
    if (product.quantity > 2)
        status = 'available';
    else if (product.quantity > 0)
        status = 'low stock';

    return {
        ...productJson,
        status
    };
};

const updateStockById = async ({ id, ownerId, operation, quantity }) => {
    if (!['restock', 'destock'].includes(operation)) {
        throw new CustomError({ statusCode: 400, code: 'BAD_REQUEST', message: 'Operation must be restock or destock' });
    }

    if (typeof quantity !== 'number') {
        throw new CustomError({ statusCode: 400, code: 'BAD_REQUEST', message: 'Quantity must be a positive number' });
    }

    if (quantity <= 0) {
        throw new CustomError({ statusCode: 400, code: 'BAD_REQUEST', message: 'Quantity must be a positive number' });
    }

    const product = await Products.findOne({ _id: id, owner: ownerId }).exec();
    if (!product) {
        throw new CustomError({ statusCode: 404, code: 'NOT_FOUND', message: 'Product not found' });
    }

    const nextQuantity = operation === 'restock'
        ? product.quantity + quantity
        : product.quantity - quantity;

    if (nextQuantity < 0) {
        throw new CustomError({ statusCode: 400, code: 'BAD_REQUEST', message: 'Quantity cannot be negative' });
    }

    product.quantity = nextQuantity;
    await product.save();

    const productJson = product.toJSON();

    let status = 'out of stock';
    if (product.quantity > 2)
        status = 'available';
    else if (product.quantity > 0)
        status = 'low stock';

    return {
        ...productJson,
        status
    };
};

const deleteById = async ({ id, ownerId }) => {
    const product = await Products.findOneAndDelete({ _id: id, owner: ownerId }).exec();

    if (!product) {
        throw new CustomError({ statusCode: 404, code: 'NOT_FOUND', message: 'Product not found' });
    }
};

const getByUser = async ({ userId, ownerId }) => {
    if (String(userId) !== String(ownerId)) {
        throw new CustomError({ statusCode: 403, code: 'FORBIDDEN', message: 'You can only view your own products' });
    }

    const products = await Products.find({ owner: userId }).sort({ createdAt: -1 }).exec();
    return products.map((product) => {
        const productJson = product.toJSON();

        let status = 'out of stock';
        if (product.quantity > 2)
            status = 'available';
        else if (product.quantity > 0)
            status = 'low stock';

        return {
            ...productJson,
            status
        };
    });
};

const list = async ({ ownerId, limit = 10, skip = 0, status }) => {
    const numericLimit = Number(limit) > 0 ? Number(limit) : 10;
    const numericSkip = Number(skip) >= 0 ? Number(skip) : 0;

    const query = { owner: ownerId };
    if (status === 'available') {
        query.quantity = { $gt: 2 };
    }
    else if (status === 'low stock') {
        query.quantity = { $gt: 0, $lte: 2 };
    }
    else if (status === 'out of stock') {
        query.quantity = 0;
    }

    const products = await Products.find(query)
        .limit(numericLimit)
        .skip(numericSkip)
        .sort({ createdAt: -1 })
        .exec();

    return products.map((product) => {
        const productJson = product.toJSON();

        let status = 'out of stock';
        if (product.quantity > 2)
            status = 'available';
        else if (product.quantity > 0)
            status = 'low stock';

        return {
            ...productJson,
            status
        };
    });
};

module.exports = {
    create,
    updateById,
    updateStockById,
    deleteById,
    getByUser,
    list
};
