<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cartStore';

const cartStore = useCartStore();
const { items, totalPrice } = storeToRefs(cartStore);

const formattedTotal = computed(() => totalPrice.value.toFixed(2));

const removeItem = (id) => {
  cartStore.removeFromCart(id);
};

const clearCart = () => {
  cartStore.clearCart();
};
</script>

<template>
  <section class="page">
    <h2 class="section-title">Cart</h2>

    <div v-if="items.length === 0" class="card">
      <p>Your cart is empty.</p>
    </div>

    <div v-else class="card cart">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>$ {{ item.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>$ {{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button class="btn btn-outline" @click="removeItem(item.id)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
        <span>Total</span>
        <strong>$ {{ formattedTotal }}</strong>
      </div>

      <div class="cart-actions">
        <button class="btn btn-outline" @click="clearCart">Clear Cart</button>
      </div>
    </div>
  </section>
</template>
