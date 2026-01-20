<template>
  <div class="container">
    <div class="row border p-4 my-5 rounded">
      <div class="col-9">
        <button
          class="btn btn-danger"
          :disabled="isSeeding"
          @click="handleSeed">
          <span
            v-if="isSeeding"
            class="spinner-border spinner-border-sm me-2"></span>
          {{ isSeeding ? "Generating..." : "Generate Fake Products" }}
        </button>

        <form v-on:submit.prevent="handleSubmit">
          <div class="h2 text-center text-success"
            >{{ productIdUpdate ? "Update" : "Create" }} Product</div
          >
          <hr />
          <div
            v-if="errorList.length > 0"
            class="alert alert-danger pb-0 mb-0">
            Please fix the following errors:
            <ul
              v-for="error in errorList"
              class="pb-0">
              <li class="pb-0 mb-0">{{ error }}</li>
            </ul>
          </div>

          <div class="mt-3">
            <span class="text-muted">Name</span>
            <input
              type="text"
              class="form-control"
              v-model.trim="productObj.name" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Description</span>
            <textarea
              type="text"
              class="form-control"
              v-model="productObj.description"></textarea>
          </div>
          <div class="mt-3">
            <span class="text-muted">Price</span>
            <input
              type="number"
              class="form-control"
              v-model.number="productObj.price" />
          </div>

          <div class="mt-3">
            <span class="text-muted">Sale Price</span>
            <input
              type="number"
              class="form-control"
              v-model.number="productObj.salePrice" />
          </div>
          <div class="mt-3">
            <span class="text-muted">Tags (comma-seperated)</span>
            <input
              type="text"
              class="form-control"
              placeholder="e.g., modern, classic, luxury"
              v-model="productObj.tags" />
          </div>
          <div class="form-check form-switch pt-3">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              v-model="productObj.isBestSeller" />

            <label
              class="form-check-label"
              for="bestseller">
              Bestseller
            </label>
          </div>
          <div class="mt-3">
            <label class="text-muted">Category</label>
            <select
              class="form-select"
              v-model="productObj.category">
              <option
                disabled
                value=""
                >-- Select category --</option
              >
              <option
                v-for="category in PRODUCT_CATEGORIES"
                :key="category"
                :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Image</label>
            <div class="input-group">
              <input
                type="file"
                class="form-control"
                @change="handleImageUpload"
                :disabled="isImageUploading" />
            </div>
          </div>
          <div class="pt-3">
            <button
              class="btn btn-success m-2 w-25"
              :disabled="isLoading || isImageUploading">
              <span
                v-if="isLoading || isImageUploading"
                class="spinner-border spinner-border-sm me-2">
              </span>
              Submit
            </button>
            <a
              href="/"
              class="btn btn-secondary m-2 w-25">
              Cancel
            </a>
          </div>
        </form>
      </div>
      <div class="col-3">
        <img
          :src="productObj.image || `https://placehold.co/600x400`"
          class="img-fluid w-100 m-3 p-3 rounded"
          alt="Product
        preview" />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { ROUTE_NAMES } from "@/constants/routeNames";
  import { PRODUCT_CATEGORIES } from "@/constants/appConstants";
  import { showError, showSuccess } from "@/utility/useSwal";
  import productService from "@/service/productService";
  import { seedProducts } from "@/utility/seeder";
  import { uploadToCloudinary } from "@/utility/cloudinary";
  const router = useRouter();
  const route = useRoute();
  const productIdUpdate = route.params.id;
  const isLoading = ref(false);
  const isImageUploading = ref(false);

  const errorList = reactive([]);
  const productObj = reactive({
    name: "",
    description: "",
    price: 0,
    salePrice: 0,
    tags: "",
    isBestSeller: false,
    category: "",
    image: "",
  });
  const seedCount = ref(10);
  const isSeeding = ref(false);

  const handleSeed = async () => {
    const ok = confirm(`Generate ${seedCount.value} fake products?`);
    if (!ok) return;

    try {
      isSeeding.value = true;
      await seedProducts(seedCount.value);
      alert("✅ Fake products generated successfully!");
    } catch (err) {
      alert("❌ Failed to generate products");
      console.error(err);
    } finally {
      isSeeding.value = false;
    }
  };

  const handleSubmit = async () => {
    try {
      isLoading.value = true;
      errorList.length = 0;
      if (productObj.name.trim().length < 3) {
        errorList.push("Name should be at least 3 character long");
      }
      if (productObj.price <= 0) {
        errorList.push("Price should be greater than 0");
      }
      if (productObj.category === "") {
        errorList.push("Please select a catageory");
      }
      if (!errorList.length) {
        const payload = {
          ...productObj,
          price: Number(productObj.price),
          salePrice: productObj.salePrice ? Number(productObj.salePrice) : null,
          tags: productObj.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean),
          isBestSeller: Boolean(productObj.isBestSeller),
        };
        if (productIdUpdate) {
          await productService.updateProduct(productIdUpdate, payload);
        } else {
          await productService.createProduct(payload);
        }

        showSuccess(
          productIdUpdate
            ? "Product updated successfully!"
            : "Product added successfully!",
        );
        router.push({ name: ROUTE_NAMES.PRODUCT_LIST });
      }
    } catch (err) {
      showError(err?.message || String(err));
    } finally {
      isLoading.value = false;
    }
  };
  const handleImageUpload = async imageFile => {
    const image = imageFile.target.files[0];
    if (!imageFile) return true;
    isImageUploading.value = true;
    try {
      const imageUrl = await uploadToCloudinary(image);
      productObj.image = imageUrl;
      console.log(productObj);
    } catch (err) {
      console.log(err);
    } finally {
      isImageUploading.value = false;
    }
  };
  onMounted(async () => {
    if (!productIdUpdate) return;
    isLoading.value = true;
    try {
      const product = await productService.getProduct(productIdUpdate);
      Object.assign(productObj, {
        ...product,
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  });
</script>
