<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import ProductDetails from '../components/ProductDetails.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/productStore';

const route = useRoute();
const productStore = useProductStore();
const { products, loading, error } = storeToRefs(productStore);

const productId = computed(() => String(route.params.id));

const currentProduct = computed(() =>
  productStore.getProductById(productId.value)
);

const relatedProducts = computed(() =>
  products.value.filter((item) => String(item.id) !== productId.value)
);

onMounted(() => {
  if (products.value.length === 0) {
    productStore.fetchProducts();
  }
});
</script>

<template>
  <section class="page">
    <div v-if="loading" class="card">
      <p>Loading product...</p>
    </div>

    <div v-else-if="error" class="card">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="currentProduct">
      <ProductDetails :product="currentProduct" />

      <h3 class="section-title">Related Products</h3>

      <div class="grid">
        <ProductCard
          v-for="product in relatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>

    <div v-else class="card">
      <p>Product not found.</p>
    </div>
  </section>
</template>
