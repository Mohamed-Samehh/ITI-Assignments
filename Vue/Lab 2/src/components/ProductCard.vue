<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const finalPrice = computed(() => {
  const price = props.product.price || 0;
  const discount = props.product.discount || 0;
  return (price - (price * discount) / 100).toFixed(2);
});

onMounted(() => {
  console.log(`ProductCard mounted for ID: ${props.product.id}`);
});

onUnmounted(() => {
  console.log(`ProductCard unmounted for ID: ${props.product.id}`);
});
</script>

<template>
  <div class="card">
    <img :src="product.image" :alt="product.name" />

    <div class="card-body">
      <div class="card-title">
        <h3>{{ product.name }}</h3>
        <span v-if="product.badge" class="badge">{{ product.badge }}</span>
      </div>

      <div class="price-row">
        <span class="price">$ {{ finalPrice }}</span>
        <span v-if="product.discount > 0" class="price-old">
          $ {{ product.price }}
        </span>
      </div>

      <RouterLink class="btn btn-outline" :to="`/product/${product.id}`">
        View Product
      </RouterLink>
    </div>
  </div>
</template>
