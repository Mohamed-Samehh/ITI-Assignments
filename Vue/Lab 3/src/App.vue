<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="app">
    <NavBar />

    <main class="container">
      <RouterView />
    </main>
  </div>
</template>
