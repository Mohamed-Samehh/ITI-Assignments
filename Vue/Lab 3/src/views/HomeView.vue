<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import CarouselBanner from '../components/CarouselBanner.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/productStore';

const productStore = useProductStore();
const { products, loading, error } = storeToRefs(productStore);

onMounted(() => {
  if (products.value.length === 0) {
    productStore.fetchProducts();
  }
});
</script>

<template>
  <section class="page">
    <CarouselBanner />

    <h2 class="section-title">Products</h2>

    <div v-if="loading" class="card">
      <p>Loading products...</p>
    </div>

    <div v-else-if="error" class="card">
      <p>{{ error }}</p>
    </div>

    <div v-else class="grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
