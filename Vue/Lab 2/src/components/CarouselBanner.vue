<script setup>
import { onMounted, onUnmounted } from 'vue';

onMounted(() => {
  console.log('CarouselBanner mounted');
});

onUnmounted(() => {
  console.log('CarouselBanner unmounted');
});
</script>

<template>
  <section class="carousel">
    <div class="carousel-track">
      <div class="carousel-item">
        <img
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
          alt="Spring Collection"
        />
      </div>
      <div class="carousel-item">
        <img
          src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80"
          alt="Everyday Comfort"
        />
      </div>
      <div class="carousel-item">
        <img
          src="https://images.unsplash.com/photo-1528701800489-20be3c69273f?auto=format&fit=crop&w=1200&q=80"
          alt="New Arrivals"
        />
      </div>
    </div>
  </section>
</template>
