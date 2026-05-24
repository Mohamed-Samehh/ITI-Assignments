<script>
export default {
  name: "App",

  data() {
    return {
      shopName: "Cozy Shop",
      tagline: "Comfort for every step",
      relatedTitle: "Related Products",
      footerText: "© 2026 Cozy Shop — All rights reserved",
      buyLabel: "Buy Now",
      outOfStockLabel: "Out of Stock",
      currency: "$",

      product: {
        id: 1,
        name: "Cozy Sneakers",
        description:
          "High-quality sneakers that go with everything you wear.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
        badge: "NEW",
        price: 120,
        discount: 20,
        tags: ["Fashion", "Casual", "Sport"],
        isAvailable: true,
      },

      relatedProducts: [
        {
          id: 2,
          name: "Running Shoes",
          price: 90,
          discount: 10,
          image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
        },
        {
          id: 3,
          name: "Casual Boots",
          price: 150,
          discount: 0,
          image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&h=400&fit=crop",
        },
        {
          id: 4,
          name: "Flip Flops",
          price: 30,
          discount: 50,
          image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop",
        },
      ],
    };
  },

  computed: {
    discountedPrice() {
      const p = this.product.price;
      const d = this.product.discount;
      return (p - (p * d) / 100).toFixed(2);
    },

    badgeStyle() {
      const map = {
        NEW: "bg-success",
        HOT: "bg-danger",
        SALE: "bg-warning text-dark",
        LIMITED: "bg-info text-dark",
      };
      return map[this.product.badge] || "bg-primary";
    },
  },

  methods: {
    finalPrice(item) {
      return (item.price - (item.price * item.discount) / 100).toFixed(2);
    },
  },
};
</script>

<template>
  <div class="bg-light min-vh-100">
    <div class="container py-4">
      <!-- header -->
      <header
        class="d-flex justify-content-between align-items-center bg-white shadow-sm rounded p-3 mb-4"
      >
        <h1 class="h4 m-0 fw-bold">{{ shopName }}</h1>
        <small class="text-muted">{{ tagline }}</small>
      </header>

      <!-- main product -->
      <section class="card shadow-sm mb-5">
        <div class="row g-0">
          <div class="col-md-5 p-3">
            <img
              :src="product.image"
              :alt="product.name"
              class="img-fluid rounded w-100"
            />
          </div>

          <div class="col-md-7 p-4">
            <div class="d-flex align-items-center gap-2 mb-2">
              <h2 class="h3 m-0">{{ product.name }}</h2>

              <span
                v-if="product.badge"
                class="badge"
                :class="badgeStyle"
                :style="{ fontSize: '0.85rem' }"
              >
                {{ product.badge }}
              </span>

              <span
                v-if="!product.isAvailable"
                class="badge bg-secondary"
              >
                {{ outOfStockLabel }}
              </span>
            </div>

            <p class="text-muted">{{ product.description }}</p>

            <div class="mb-3">
              <span
                v-for="tag in product.tags"
                :key="tag"
                class="badge bg-light text-dark border me-1"
              >
                {{ tag }}
              </span>
            </div>

            <div class="d-flex align-items-baseline gap-2 mb-3">
              <span class="h3 text-primary fw-bold m-0">
                {{ currency }}{{ discountedPrice }}
              </span>

              <span
                v-if="product.discount > 0"
                class="text-muted text-decoration-line-through"
              >
                {{ currency }}{{ product.price }}
              </span>

              <span
                v-if="product.discount > 0"
                class="badge bg-success"
              >
                -{{ product.discount }}%
              </span>
            </div>

            <button
              class="btn btn-primary"
              :disabled="!product.isAvailable"
            >
              {{ product.isAvailable ? buyLabel : outOfStockLabel }}
            </button>
          </div>
        </div>
      </section>

      <!-- related products -->
      <section class="mb-5">
        <h3 class="h4 fw-bold mb-3">{{ relatedTitle }}</h3>

        <div class="row g-3">
          <div
            v-for="item in relatedProducts"
            :key="item.id"
            class="col-12 col-sm-6 col-lg-4"
          >
            <div class="card h-100 shadow-sm">
              <img
                :src="item.image"
                :alt="item.name"
                class="card-img-top p-3"
              />
              <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>

                <div class="d-flex align-items-baseline gap-2">
                  <span class="fw-bold text-primary">
                    {{ currency }}{{ finalPrice(item) }}
                  </span>

                  <span
                    v-if="item.discount > 0"
                    class="text-muted text-decoration-line-through small"
                  >
                    {{ currency }}{{ item.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- footer -->
      <footer class="text-center text-muted py-3 border-top">
        <small>{{ footerText }}</small>
      </footer>
    </div>
  </div>
</template>
