<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import ProductDetails from '../components/ProductDetails.vue';
import ProductCard from '../components/ProductCard.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['buy']);
const route = useRoute();

const productId = computed(() => Number(route.params.id));

const currentProduct = computed(() =>
  props.products.find((item) => item.id === productId.value)
);

const relatedProducts = computed(() =>
  props.products.filter((item) => item.id !== productId.value)
);

const handleBuy = (id) => {
  emit('buy', id);
};

onMounted(() => {
  console.log(`ProductView mounted for ID: ${productId.value}`);
});

onUnmounted(() => {
  console.log('ProductView unmounted');
});
</script>

<template>
  <section class="page">
    <div v-if="currentProduct">
      <ProductDetails :product="currentProduct" @buy="handleBuy" />

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
