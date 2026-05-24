<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  console.log('AboutView mounted');
});

onUnmounted(() => {
  console.log('AboutView unmounted');
});
</script>

<template>
  <section class="page">
    <h2 class="section-title">About</h2>

    <p><strong>Name:</strong> Your Name</p>
    <p><strong>Course:</strong> VueJS Course - Day 2</p>
    <p><strong>Institute:</strong> ITI</p>

    <p class="muted">
      Cozy Shop is a small store focused on comfortable footwear for everyday
      use. We keep the catalog simple, clear, and easy to browse.
    </p>
  </section>
</template>
