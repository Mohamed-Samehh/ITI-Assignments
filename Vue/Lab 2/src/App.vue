<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

const products = ref([
  {
    id: 1,
    name: 'Cozy Sneakers',
    description: 'High-quality sneakers that go with everything you wear.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    badge: 'NEW',
    price: 120,
    discount: 20,
    stock: 10,
    tags: ['Fashion', 'Casual', 'Sport'],
  },
  {
    id: 2,
    name: 'Running Shoes',
    description: 'Built for speed and comfort on any terrain.',
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
    badge: '',
    price: 90,
    discount: 10,
    stock: 5,
    tags: ['Sport', 'Running'],
  },
  {
    id: 3,
    name: 'Casual Boots',
    description: 'Rugged boots for everyday adventures.',
    image:
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
    badge: 'SALE',
    price: 150,
    discount: 0,
    stock: 8,
    tags: ['Casual', 'Winter'],
  },
  {
    id: 4,
    name: 'Flip Flops',
    description: 'Light and breezy for sunny days.',
    image:
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=600&q=80',
    badge: '',
    price: 30,
    discount: 50,
    stock: 20,
    tags: ['Summer', 'Casual'],
  },
]);

const totalStock = computed(() =>
  products.value.reduce((sum, item) => sum + item.stock, 0)
);

const productLinkId = computed(() => products.value[0]?.id || 1);

const handleBuy = (productId) => {
  const item = products.value.find((product) => product.id === productId);

  if (!item || item.stock <= 0) {
    return;
  }

  item.stock -= 1;
};

onMounted(() => {
  console.log('App mounted');
});

onUnmounted(() => {
  console.log('App unmounted');
});
</script>

<template>
  <div class="app">
    <NavBar :product-link-id="productLinkId" :total-stock="totalStock" />

    <main class="container">
      <RouterView v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.fullPath"
          :products="products"
          @buy="handleBuy"
        />
      </RouterView>
    </main>
  </div>
</template>
