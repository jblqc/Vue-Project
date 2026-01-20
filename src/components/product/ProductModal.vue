<template>
  <!-- Product Details Modal -->
  <div
    class="modal"
    :id="`productDetailsModal-${product.id}`"
    tabindex="-1"
    aria-hidden="true">
    <div
      class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">Product Details</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="row g-4">
            <!-- Image -->
            <div class="col-12 col-md-5">
              <div class="ratio ratio-4x3 rounded overflow-hidden bg-light">
                <img
                  :src="product.image || 'https://placehold.co/400x400'"
                  class="w-100 h-100 object-fit-cover"
                  alt="Product image" />
              </div>
            </div>

            <!-- Details -->
            <div class="col-12 col-md-7">
              <!-- Badges -->
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="badge bg-secondary bg-opacity-10 text-secondary">
                  Category
                </span>
                <span class="badge bg-warning bg-opacity-10 text-warning">
                  Bestseller
                </span>
                <span class="badge bg-info bg-opacity-10 text-info">
                  On Sale
                </span>
              </div>

              <!-- Name -->
              <h4 class="mb-1">{{ product.name }}</h4>

              <!-- Description -->
              <p class="text-muted small">
                {{ product.description }}
              </p>

              <!-- Price -->
              <div class="d-flex align-items-end gap-2 mb-3">
                <div
                  class="small"
                  v-if="product.salePrice">
                  <span class="fw-semibold">₱{{ product.salePrice }}</span>
                  <span
                    class="text-danger ms-2"
                    :style="{
                      textDecoration: product.salePrice
                        ? 'line-through'
                        : 'none',
                    }"
                    >₱{{ product.price }}</span
                  >
                </div>

                <span
                  class="badge bg-danger bg-opacity-10 text-danger"
                  v-if="product.salePrice">
                  Save ₱{{ product.price - product.salePrice }}
                </span>
              </div>

              <!-- Tags -->
              <div class="mb-3">
                <div class="small text-muted mb-1">Tags</div>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    class="badge bg-info bg-opacity-10 text-info small"
                    v-for="(tag, index) in product.tags"
                    :key="index">
                    {{ tag }}</span
                  >
                </div>
              </div>

              <!-- Meta -->
              <div class="row g-2">
                <div class="col-6">
                  <div class="border rounded p-2">
                    <div class="small text-muted">Category</div>
                    <div class="fw-semibold">{{ product.category }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="goToEdit">
            <i class="bi bi-pencil-fill me-1"></i> Edit Product
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ROUTE_NAMES } from "@/constants/routeNames";
  import { Modal } from "bootstrap";
  import { useRouter } from "vue-router";
  const router = useRouter();
  const props = defineProps({ product: { type: Object, required: true } });
  const product = props.product;
  const goToEdit = () => {
    router.push({
      name: ROUTE_NAMES.PRODUCT_UPDATE,
      params: { id: product.id },
    });
  };
</script>
