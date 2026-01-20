import { createRouter, createWebHistory } from "vue-router";
import { ROUTE_NAMES } from "@/constants/routeNames";
import { useAuthStore } from "@/stores/useAuthStore";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: ROUTE_NAMES.HOME,
      component: () => import("../views/home/Home.vue"),
    },
    {
      path: "/contact-us",
      name: ROUTE_NAMES.CONTACT_US,
      component: () => import("../views/home/ContactUs.vue"),
    },
    {
      path: "/sign-up",
      name: ROUTE_NAMES.SIGN_UP,
      component: () => import("../views/auth/SignUp.vue"),
    },
    {
      path: "/sign-in",
      name: ROUTE_NAMES.SIGN_IN,
      component: () => import("../views/auth/SignIn.vue"),
    },
    {
      path: "/product-list",
      name: ROUTE_NAMES.PRODUCT_LIST,
      component: () => import("../views/product/ProductList.vue"),
      beforeEnter: [isAuthenticated, isAdmin],
    },
    {
      path: "/product-create",
      name: ROUTE_NAMES.PRODUCT_CREATE,
      component: () => import("../views/product/ProductUpsert.vue"),
      beforeEnter: [isAuthenticated, isAdmin],
    },
    {
      path: "/product-update/:id",
      name: ROUTE_NAMES.PRODUCT_UPDATE,
      component: () => import("../views/product/ProductUpsert.vue"),
      beforeEnter: [isAuthenticated, isAdmin],
    },
    {
      path: "/access-denied",
      name: ROUTE_NAMES.ACCESS_DENIED,
      component: () => import("../views/auth/AccessDenied.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: ROUTE_NAMES.NOT_FOUND,
      component: () => import("../views/auth/NotFound.vue"),
    },
  ],
});
router.beforeEach(async () => {
  const authStore = useAuthStore();
  if (!authStore.initialized) {
    await authStore.initializeAuth();
  }
  return true;
});

function isAdmin() {
  const authStore = useAuthStore();
  return authStore.isAdmin === true
    ? true
    : { name: ROUTE_NAMES.ACCESS_DENIED };
}

function isAuthenticated() {
  const authStore = useAuthStore();
  return authStore.isAuthenticated === true
    ? true
    : { name: ROUTE_NAMES.SIGN_IN };
}

export default router;
