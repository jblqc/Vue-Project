<template>
  <div class="col-12 col-sm-6 col-lg-4">
    <div class="card h-100 border-0 shadow-sm">
      <div class="position-relative">
        <img
          :src="product.image || 'https://placehold.co/50x50'"
          class="card-img-top object-fit-cover"
          style="height: 180px"
          alt="Product" />

        <!-- badges -->
        <div class="position-absolute top-0 start-0 p-2 d-flex gap-2">
          <span
            class="badge text-bg-warning"
            v-if="product.isBestSeller"
            >Bestseller</span
          >
          <span
            class="badge text-bg-danger"
            v-if="product.salePrice"
            >Sale</span
          >
        </div>

        <!-- price pill -->
        <div class="position-absolute bottom-0 end-0 p-2">
          <span
            class="badge text-bg-dark fs-6"
            v-if="product.salePrice"
            >₱{{ product.salePrice }}</span
          >
          <span
            class="badge text-bg-dark fs-6"
            v-else
            >₱{{ product.price }}</span
          >
        </div>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div>
            <h5 class="card-title mb-1">{{ product.name }}</h5>
            <div class="text-muted small">
              <span class="badge bg-secondary bg-opacity-10 text-secondary">
                {{ product.category }}</span
              >
            </div>
          </div>
          <button class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-heart"></i>
          </button>
        </div>

        <p class="card-text text-muted small mt-2 mb-3">
          {{ product.description }}</p
        >

        <div class="d-flex flex-wrap gap-1 mb-3">
          <span
            class="badge bg-info bg-opacity-10 text-info"
            v-for="(tag, index) in product.tags"
            :key="index"
            >{{ tag }}</span
          >
        </div>

        <div class="d-flex align-items-center justify-content-between">
          <div
            class="small"
            v-if="product.salePrice">
            <span class="fw-semibold">₱{{ product.salePrice }}</span>
            <span
              class="text-danger ms-2"
              :style="{
                textDecoration: product.salePrice ? 'line-through' : 'none',
              }"
              >₱{{ product.price }}</span
            >
          </div>

          <div class="btn-group">
            <button class="btn btn-success btn-sm">
              <i class="bi bi-cart-plus me-1"></i>
              Add
            </button>
            <button
              class="btn btn-outline-secondary btn-sm"
              data-bs-toggle="modal"
              :data-bs-target="`#productDetailsModal-${product.id}`">
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
    <ProductModal :product="product" />
  </div>
</template>
<script setup>
  import { ref } from "vue";
  import ProductModal from "./ProductModal.vue";
  import router from "@/router/routes";
  const props = defineProps({ product: { type: Object, required: true } });
  const product = props.product;
</script>
