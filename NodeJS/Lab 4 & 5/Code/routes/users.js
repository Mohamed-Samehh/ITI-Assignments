const express = require('express');
const { productsController, usersController } = require('../controllers');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const payload = await usersController.create(req.body);
    return res.status(201).json(payload);
  }
  catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const payload = await usersController.login(req.body);
    return res.json(payload);
  }
  catch (error) {
    next(error);
  }
});

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const firstNames = await usersController.listFirstNames();
    return res.json({ firstNames });
  }
  catch (error) {
    next(error);
  }
});

router.get('/:userId/products', authMiddleware, async (req, res, next) => {
  try {
    const products = await productsController.getByUser({
      userId: req.params.userId,
      ownerId: req.user._id
    });

    return res.json({ products });
  }
  catch (error) {
    next(error);
  }
});

router.patch('/:id', authMiddleware, async (req, res, next) => {
  try {
    const user = await usersController.updateById({
      id: req.params.id,
      loggedInUserId: req.user._id,
      data: req.body
    });

    return res.json({
      message: 'user was edited successfully',
      user
    });
  }
  catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    await usersController.deleteById({
      id: req.params.id,
      loggedInUserId: req.user._id
    });

    return res.json({ message: 'user deleted successfully' });
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
