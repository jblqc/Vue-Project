<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />

    <main class="container flex-fill py-4">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<script setup>
  import Header from "./components/layout/Header.vue";
  import Footer from "./components/layout/Footer.vue";
</script>
