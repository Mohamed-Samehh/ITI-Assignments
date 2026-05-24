import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductView from '../views/ProductView.vue';
import AboutView from '../views/AboutView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/product/:id', name: 'product', component: ProductView },
        { path: '/about', name: 'about', component: AboutView },
    ],
});

export default router;
