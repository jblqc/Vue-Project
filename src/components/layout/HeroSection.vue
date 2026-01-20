<template>
  <section class="py-4 bg-dark border-bottom rounded-4">
    <div class="container">
      <div class="row align-items-center">
        <!-- Text -->
        <div class="col-md-6 mb-4 mb-md-0">
          <h1 class="fw-bold mb-3 text-light">
            {{ title }}
          </h1>

          <h5 class="mb-4 text-light text-opacity-50">
            {{ subtitle }}
          </h5>

          <!-- Actions slot (buttons, links, etc.) -->
          <div v-if="$slots.actions">
            <slot name="actions" />
          </div>
        </div>

        <!-- Image / Illustration -->
        <div class="col-md-6 text-center">
          <img
            v-if="image"
            :src="image"
            :alt="title"
            class="img-fluid rounded"
            style="max-height: 320px" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
  });
</script>
