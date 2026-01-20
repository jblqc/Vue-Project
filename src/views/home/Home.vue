<template>
  <!-- Home Page UI (Bootstrap-only, no Vue code) -->

  <div class="container py-4">
    <!-- Hero / Header -->
    <HeroSection
      title="Discover Premium Stones"
      subtitle="Explore quartz, marble, granite, and quartzite for your next project."
      image="/src/assets/hero-home.avif" />
    <div class="border rounded-3 p-4 mb-4 bg-body mt-4">
      <div
        class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <h1 class="mb-1">Discover Products</h1>
          <p class="text-muted mb-0">
            Browse our latest items, filter by category, and save your
            favorites.
          </p>
        </div>

        <div class="d-flex gap-2">
          <a
            href="#"
            class="btn btn-success px-4">
            <i class="bi bi-plus-square me-1"></i>
            Add Product
          </a>
          <a
            href="#"
            class="btn btn-outline-secondary px-4">
            <i class="bi bi-collection me-1"></i>
            View All
          </a>
        </div>
      </div>

      <!-- Search + Filters -->
      <div class="row g-2 mt-4">
        <div class="col-12 col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Search products
            by name, tag, or description..."
              v-model="searchText" />
          </div>
        </div>

        <div class="col-6 col-md-3">
          <select
            class="form-select"
            v-model="selectedCategory">
            <option value="">All Categories</option>
            <option
              v-for="(category, index) in categories"
              :key="index"
              >{{ category }}</option
            >
          </select>
        </div>

        <div class="col-6 col-md-3">
          <select
            class="form-select"
            v-model="selectedSort">
            <option value="">Sort by</option>

            <option
              v-for="(option, index) in options"
              :key="index"
              :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2 mt-3">
        <button
          class="btn btn-sm rounded-pill"
          :class="
            filters.bestSeller ? 'btn-secondary' : 'btn-outline-secondary'
          "
          @click="toggleFilter('bestSeller')">
          <i class="bi bi-stars me-1"></i> Bestseller
        </button>
        <button
          class="btn btn-sm rounded-pill"
          :class="filters.onSale ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="toggleFilter('onSale')">
          <i class="bi bi-tag me-1"></i> On Sale
        </button>

        <button
          class="btn btn-sm rounded-pill"
          :class="filters.under1000 ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="toggleFilter('under1000')">
          <i class="bi bi-cash-coin me-1"></i> Under ₱1,000
        </button>
      </div>
    </div>

    <!-- Loading skeleton (optional UI state) -->
    <div
      class="row g-3 mb-4"
      style="display: none">
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card h-100">
          <div class="placeholder-glow">
            <div
              class="placeholder w-100"
              style="height: 180px"></div>
          </div>
          <div class="card-body">
            <div class="placeholder-glow mb-2">
              <span class="placeholder col-8"></span>
            </div>
            <div class="placeholder-glow">
              <span class="placeholder col-10"></span>
              <span class="placeholder col-6"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="d-flex align-items-center justify-content-between mb-2">
      <div class="text-muted small"
        >Showing <strong>{{ filteredProducts.length }}</strong> products</div
      >
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-grid-3x3-gap"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>

    <div class="row g-3">
      <!-- Product Card -->
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product" />
    </div>

    <!-- Empty state (optional UI state) -->
    <div
      class="text-center py-5"
      style="display: none">
      <div class="mb-2">
        <i class="bi bi-box-seam fs-1 text-muted"></i>
      </div>
      <h5 class="mb-1">No products yet</h5>
      <p class="text-muted mb-3">Create your first product to see it here.</p>
      <RouterLink
        :to="{ name: ROUTE_NAMES.PRODUCT_CREATE }"
        class="btn btn-success">
        <i class="bi bi-plus-square me-1"></i> Add Product
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref, computed, reactive } from "vue";
  import productService from "@/service/productService";
  import ProductCard from "@/components/product/ProductCard.vue";
  import {
    PRODUCT_CATEGORIES,
    SORT_OPTIONS,
    SORT_PRICE_LOW_HIGH,
    SORT_PRICE_HIGH_LOW,
    SORT_NAME_A_Z,
    SORT_NAME_Z_A,
  } from "@/constants/appConstants";
  import { ROUTE_NAMES } from "@/constants/routeNames";
  import HeroSection from "@/components/layout/HeroSection.vue";
  const products = ref([]);
  const isLoading = ref(false);
  const searchText = ref("");
  const selectedCategory = ref("");
  const selectedSort = ref("");
  const categories = ref(PRODUCT_CATEGORIES);
  const options = ref(SORT_OPTIONS);

  const filters = reactive({
    bestSeller: false,
    onSale: false,
    under1000: false,
  });

  const toggleFilter = key => {
    filters[key] = !filters[key];
  };

  const getAllProducts = async () => {
    try {
      isLoading.value = true;
      products.value = await productService.getAllProducts();
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(getAllProducts);

  const sortProducts = list => {
    const sortKey = selectedSort.value;

    if (!sortKey) return list;

    const getEffectivePrice = p => {
      const price = Number(p.price) || 0;
      const sale = Number(p.salePrice) || 0;
      return sale > 0 && sale < price ? sale : price;
    };

    const copy = list.slice();

    switch (sortKey) {
      case SORT_PRICE_LOW_HIGH:
        return copy.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));

      case SORT_PRICE_HIGH_LOW:
        return copy.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));

      case SORT_NAME_A_Z:
        return copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      case SORT_NAME_Z_A:
        return copy.sort((a, b) => (b.name || "").localeCompare(a.name || ""));

      default:
        return copy;
    }
  };

  const filteredProducts = computed(() => {
    const txt = searchText.value.toLowerCase().trim();
    const cat = selectedCategory.value;

    const filtered = products.value.filter(p => {
      const matchesCategory = !cat || p.category === cat;
      const haystack = [
        p.name,
        p.description,
        Array.isArray(p.tags) ? p.tags.join(" ") : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !txt || haystack.includes(txt);
      const matchesBestSeller = !filters.bestSeller || p.isBestSeller === true;
      const price = Number(p.price) || 0;
      const sale = Number(p.salePrice) || 0;
      const isOnSale = sale > 0 && sale < price;
      const matchesOnSale = !filters.onSale || isOnSale;
      const effectivePrice = isOnSale ? sale : price;
      const matchesUnder1000 =
        !filters.under1000 || (effectivePrice > 0 && effectivePrice < 1000);

      return (
        matchesCategory &&
        matchesSearch &&
        matchesBestSeller &&
        matchesOnSale &&
        matchesUnder1000
      );
    });

    return sortProducts(filtered);
  });
</script>
