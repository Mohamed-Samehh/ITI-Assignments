import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useLocalStorage } from '../composables/useLocalStorage';
import { useProductStore } from './productStore';

export const useCartStore = defineStore('cart', () => {
    const items = useLocalStorage('cart', []);

    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalPrice = computed(() =>
        items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    const addToCart = (product) => {
        if (!product || product.stock <= 0) {
            return;
        }

        const existingItem = items.value.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            items.value.push({ ...product, quantity: 1 });
        }

        const productStore = useProductStore();
        productStore.decreaseStock(product.id);
    };

    const removeFromCart = (id) => {
        items.value = items.value.filter((item) => item.id !== id);
    };

    const clearCart = () => {
        items.value = [];
    };

    return {
        items,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart,
    };
});
