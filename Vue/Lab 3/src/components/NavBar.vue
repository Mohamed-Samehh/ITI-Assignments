<script setup>
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import { useCartStore } from '../stores/cartStore';

const cartStore = useCartStore();
const { totalItems } = storeToRefs(cartStore);
</script>

<template>
  <nav class="navbar">
    <div class="brand">Cozy Shop</div>

    <div class="nav-links">
      <RouterLink class="nav-link" to="/">Home</RouterLink>
      <RouterLink class="nav-link" to="/cart">
        Cart ({{ totalItems }})
      </RouterLink>
      <RouterLink class="nav-link" to="/about">About</RouterLink>
    </div>

    <div class="stock">Items: {{ totalItems }}</div>
  </nav>
</template>
