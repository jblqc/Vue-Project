<!-- Header.vue -->
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
    <div class="container-fluid">
      <RouterLink
        class="navbar-brand d-flex align-items-center gap-2"
        :to="{ name: ROUTE_NAMES.HOME }">
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          style="width: 40px" />
        <span class="fw-semibold d-none d-sm-inline">Stone Shop</span>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        id="navbarSupportedContent">
        <!-- Left nav -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item">
            <RouterLink
              class="nav-link"
              :to="{ name: ROUTE_NAMES.HOME }">
              Home
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink
              class="nav-link"
              :to="{ name: ROUTE_NAMES.CONTACT_US }">
              Contact Us
            </RouterLink>
          </li>

          <!-- Only show Product links if authenticated -->
          <template v-if="authStore.isAuthenticated">
            <li class="nav-item">
              <RouterLink
                class="nav-link"
                :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">
                Products
              </RouterLink>
            </li>

            <!-- Only show Create if admin -->
            <li
              class="nav-item"
              v-if="authStore.isAdmin">
              <RouterLink
                class="nav-link"
                :to="{ name: ROUTE_NAMES.PRODUCT_CREATE }">
                Product Create
              </RouterLink>
            </li>
          </template>
        </ul>

        <!-- Right controls -->
        <div class="d-flex align-items-center gap-2">
          <!-- Theme toggle -->
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            @click="themeStore.toggleTheme"
            :aria-label="
              themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'
            ">
            {{ themeStore.isDark ? "🌙 Dark" : "☀️ Light" }}
          </button>

          <!-- Auth loading state (optional but nice) -->
          <div
            v-if="authStore.isLoading"
            class="d-flex align-items-center gap-2">
            <span
              class="spinner-border spinner-border-sm"
              aria-hidden="true"></span>
            <span class="small text-muted">Loading…</span>
          </div>

          <!-- Not logged in -->
          <div
            v-else-if="!authStore.isAuthenticated"
            class="d-flex gap-2">
            <RouterLink
              class="btn btn-outline-primary btn-sm"
              :to="{ name: ROUTE_NAMES.SIGN_IN }">
              Sign In
            </RouterLink>
            <RouterLink
              class="btn btn-primary btn-sm"
              :to="{ name: ROUTE_NAMES.SIGN_UP }">
              Sign Up
            </RouterLink>
          </div>

          <!-- Logged in -->
          <div
            v-else
            class="dropdown">
            <button
              class="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <span class="badge text-bg-primary">
                {{ authStore.isAdmin ? "ADMIN" : "USER" }}
              </span>
              <span class="d-none d-md-inline">
                {{ authStore.user?.email || "Account" }}
              </span>
            </button>

            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-header small">
                Signed in as<br />
                <strong class="text-break">{{ authStore.user?.email }}</strong>
              </li>
              <li><hr class="dropdown-divider" /></li>

              <li v-if="authStore.isAuthenticated">
                <RouterLink
                  class="dropdown-item"
                  :to="{ name: ROUTE_NAMES.PRODUCT_LIST }">
                  Products
                </RouterLink>
              </li>

              <li v-if="authStore.isAdmin">
                <RouterLink
                  class="dropdown-item"
                  :to="{ name: ROUTE_NAMES.PRODUCT_CREATE }">
                  Create Product
                </RouterLink>
              </li>

              <li><hr class="dropdown-divider" /></li>

              <li>
                <button
                  class="dropdown-item text-danger"
                  @click="handleSignOut">
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { onMounted } from "vue";
  import { ROUTE_NAMES } from "@/constants/routeNames";
  import { useThemeStore } from "@/stores/useThemeStore";
  import { useAuthStore } from "@/stores/useAuthStore";
  import { useRouter } from "vue-router";

  const authStore = useAuthStore();
  const themeStore = useThemeStore();
  const router = useRouter();

  const handleSignOut = async () => {
    await authStore.signOutUser();
    router.push({ name: ROUTE_NAMES.HOME });
  };
</script>
