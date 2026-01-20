<template>
  <div class="container py-4">
    <div
      class="d-flex justify-content-center"
      v-if="isLoading">
      <div
        class="spinner-border"
        role="status">
      </div>
    </div>
    <div
      class="border rounded pb-3 px-2"
      v-else>
      <div
        class="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4">
        <div>
          <h1 class="text-secondary">Products</h1>
          <p class="mb-0 text-muted small">Manage your product listings</p>
        </div>
        <RouterLink
          :to="{ name: ROUTE_NAMES.PRODUCT_CREATE }"
          class="btn btn-success btn-sm gap-2 rounded-1 px-4 py-2">
          <i class="bi bi-plus-square"></i> &nbsp;
          <span>Add Product</span>
        </RouterLink>
      </div>

      <div class="card-body p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 table-striped">
            <thead>
              <tr>
                <th class="ps-3 small text-muted">Product</th>
                <th class="small text-muted">Category</th>
                <th class="small text-muted">Pricing</th>
                <th class="small text-muted">Tags</th>
                <th class="small text-muted">Bestseller</th>
                <th class="pe-3 text-end small text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in products"
                key="product.id">
                <td class="ps-3">
                  <div class="d-flex align-items-center">
                    <img
                      :src="product.image || 'https://placehold.co/50x50'"
                      class="rounded object-fit-cover me-2"
                      style="width: 50px; height: 50px" />
                    <div>
                      <div class="fw-semibold small">{{ product.name }}</div>
                      <small
                        class="text-muted text-truncate d-inline-block"
                        style="max-width: 200px">
                        {{ product.description }}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    class="badge bg-secondary bg-opacity-10 text-secondary small">
                    {{ product.category }}
                  </span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="fw-semibold small">P{{ product.price }}</span>
                    <span class="text-danger small">
                      P{{ product.salePrice }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      class="badge bg-info bg-opacity-10 text-info small"
                      v-for="tag in product.tags"
                      >{{ tag }}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    class="badge bg-warning bg-opacity-10 text-warning small"
                    v-if="product.isBestSeller">
                    Bestseller
                  </span>
                  <span
                    class="text-muted text-center"
                    v-else
                    >---</span
                  >
                </td>
                <td class="pe-3 text-end">
                  <button
                    class="btn btn-sm btn-outline-secondary m-2"
                    @click="updateProduct(product.id)">
                    <i class="bi bi-pencil-fill"></i> Edit
                  </button>

                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="deleteProduct(product.id)">
                    <i class="bi bi-trash3-fill"></i> Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref } from "vue";
  import { ROUTE_NAMES } from "@/constants/routeNames";
  import productService from "@/service/productService";
  import { showConfirm, showError, showSuccess } from "@/utility/useSwal";
  import { useRoute, useRouter } from "vue-router";
  const route = useRoute();
  const router = useRouter();
  const products = ref([]);
  const isLoading = ref(false);
  onMounted(async () => {
    getAllProducts();
  });
  const getAllProducts = async () => {
    try {
      isLoading.value = true;
      products.value = await productService.getAllProducts();
    } catch (error) {
      showError(error);
    } finally {
      isLoading.value = false;
    }
  };
  const deleteProduct = async id => {
    try {
      const swalResult = await showConfirm("Delete Product");
      console.log(swalResult);
      if (swalResult) {
        isLoading.value = true;
        await productService.deleteProduct(id);
        products.value = products.value.filter(p => p.id !== id);
        showSuccess("Product deleted");
      }
    } catch (error) {
      showError(error);
    } finally {
      isLoading.value = false;
    }
  };
  const updateProduct = async id => {
    router.push({
      name: ROUTE_NAMES.PRODUCT_UPDATE,
      params: { id: id },
    });
  };
</script>
