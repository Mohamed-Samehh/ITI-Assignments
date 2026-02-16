const express = require('express');
const { productsController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            owner: req.user._id
        };

        if (payload.category && !payload.categories) {
            payload.categories = Array.isArray(payload.category) ? payload.category : [payload.category];
            delete payload.category;
        }

        const product = await productsController.create(payload);
        return res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const body = { ...req.body };
        if (body.category && !body.categories) {
            body.categories = Array.isArray(body.category) ? body.category : [body.category];
            delete body.category;
        }

        const product = await productsController.updateById({
            id: req.params.id,
            ownerId: req.user._id,
            data: body
        });

        return res.json(product);
    }
    catch (error) {
        next(error);
    }
});

router.patch('/:id/stock', async (req, res, next) => {
    try {
        const product = await productsController.updateStockById({
            id: req.params.id,
            ownerId: req.user._id,
            operation: req.body.operation,
            quantity: req.body.quantity
        });

        return res.json(product);
    }
    catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await productsController.deleteById({
            id: req.params.id,
            ownerId: req.user._id
        });

        return res.json({ message: 'product deleted successfully' });
    }
    catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const products = await productsController.list({
            ownerId: req.user._id,
            limit: req.query.limit,
            skip: req.query.skip,
            status: req.query.status
        });

        return res.json({ products });
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
