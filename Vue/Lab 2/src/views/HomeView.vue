<script setup>
import { onMounted, onUnmounted } from 'vue';
import CarouselBanner from '../components/CarouselBanner.vue';
import ProductCard from '../components/ProductCard.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

onMounted(() => {
  console.log(`HomeView mounted - ${props.products.length} products loaded`);
});

onUnmounted(() => {
  console.log('HomeView unmounted');
});
</script>

<template>
  <section class="page">
    <CarouselBanner />

    <h2 class="section-title">Products</h2>

    <div class="grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
