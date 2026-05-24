import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

export const useProductStore = defineStore('product', () => {
    const products = ref([]);
    const { data, error, loading, getAll, update } = useApi(
        'http://localhost:3000/products'
    );

    const fetchProducts = async () => {
        const result = await getAll();
        if (Array.isArray(result)) {
            products.value = result;
        }
    };

    const decreaseStock = async (productId) => {
        const index = products.value.findIndex((item) => item.id === productId);

        if (index === -1) {
            return;
        }

        const product = products.value[index];

        if (product.stock <= 0) {
            return;
        }

        const updatedProduct = { ...product, stock: product.stock - 1 };
        products.value[index] = updatedProduct;

        const savedProduct = await update(updatedProduct);
        if (savedProduct) {
            products.value[index] = savedProduct;
        }
    };

    const getProductById = (id) =>
        products.value.find((item) => String(item.id) === String(id));

    return {
        products,
        loading,
        error,
        fetchProducts,
        decreaseStock,
        getProductById,
    };
});
