<script setup>
import { computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['buy']);

const discountedPrice = computed(() => {
  const price = props.product.price || 0;
  const discount = props.product.discount || 0;
  return (price - (price * discount) / 100).toFixed(2);
});

const isOutOfStock = computed(() => props.product.stock <= 0);

const buyNow = () => {
  emit('buy', props.product.id);
};

onMounted(() => {
  console.log(`ProductDetails mounted for ID: ${props.product.id}`);
});

onUnmounted(() => {
  console.log(`ProductDetails unmounted for ID: ${props.product.id}`);
});
</script>

<template>
  <section class="details">
    <div class="details-media">
      <img :src="product.image" :alt="product.name" />
    </div>

    <div class="details-info">
      <h2>{{ product.name }}</h2>
      <p class="muted">{{ product.description }}</p>

      <div class="tag-row">
        <span v-for="tag in product.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>

      <div class="price-row">
        <span class="price">$ {{ discountedPrice }}</span>
        <span v-if="product.discount > 0" class="price-old">
          $ {{ product.price }}
        </span>
        <span v-if="product.discount > 0" class="badge">
          -{{ product.discount }}%
        </span>
      </div>

      <div class="stock-row">
        <span>Stock: {{ product.stock }}</span>
        <span v-if="isOutOfStock" class="stock-out">Out of Stock</span>
      </div>

      <button class="btn" :disabled="isOutOfStock" @click="buyNow">
        {{ isOutOfStock ? 'Out of Stock' : 'Buy Now' }}
      </button>
    </div>
  </section>
</template>
