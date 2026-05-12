const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../src/models/Product');
const {
    createProduct,
    getAvailableProducts,
    discontinue,
} = require('../src/services/productService');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
    await Product.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

test('createProduct makes and returns a product', async () => {
    const product = await createProduct({
        name: 'Phone',
        slug: 'phone',
        price: 500,
    });

    expect(product.name).toBe('Phone');
    expect(product.slug).toBe('phone');
    expect(product.inStock).toBe(true);
});

test('createProduct throws for duplicate slug', async () => {
    await Product.create({ name: 'Phone', slug: 'phone', price: 500 });

    await expect(
        createProduct({ name: 'Another Phone', slug: 'phone', price: 600 })
    ).rejects.toThrow('Slug already in use');
});

test('createProduct rejects negative price', async () => {
    await expect(
        createProduct({ name: 'Bad Product', slug: 'bad-product', price: -1 })
    ).rejects.toThrow('min');
});

test('getAvailableProducts returns only in-stock products', async () => {
    await Product.create([
        { name: 'A', slug: 'a', price: 10, inStock: true },
        { name: 'B', slug: 'b', price: 20, inStock: false },
    ]);

    const products = await getAvailableProducts();

    expect(products).toHaveLength(1);
    expect(products[0].slug).toBe('a');
});

test('discontinue sets inStock to false', async () => {
    await Product.create({ name: 'A', slug: 'a', price: 10 });

    const product = await discontinue('a');

    expect(product.inStock).toBe(false);
});

test('discontinue throws for unknown slug', async () => {
    await expect(discontinue('missing')).rejects.toThrow('Product not found');
});