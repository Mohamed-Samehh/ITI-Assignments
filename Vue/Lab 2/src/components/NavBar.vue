<script setup>
import { onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

defineProps({
  productLinkId: {
    type: Number,
    required: true,
  },
  totalStock: {
    type: Number,
    required: true,
  },
});

onMounted(() => {
  console.log('NavBar mounted');
});

onUnmounted(() => {
  console.log('NavBar unmounted');
});
</script>

<template>
  <nav class="navbar">
    <div class="brand">Cozy Shop</div>

    <div class="nav-links">
      <RouterLink class="nav-link" to="/">Home</RouterLink>
      <RouterLink class="nav-link" :to="`/product/${productLinkId}`">
        Product
      </RouterLink>
      <RouterLink class="nav-link" to="/about">About</RouterLink>
    </div>

    <div class="stock">Stock: {{ totalStock }}</div>
  </nav>
</template>
