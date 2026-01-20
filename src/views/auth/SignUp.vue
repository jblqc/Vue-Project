<template>
  <div class="d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center g-4">
        <div class="col-12 col-md-9 col-lg-5 col-xl-4">
          <div class="card auth-card border-0 shadow-lg overflow-hidden">
            <div class="auth-accent"></div>

            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <div
                  class="auth-logo rounded-4 mx-auto d-grid place-items-center mb-3">
                  <i class="bi bi-person-plus fs-4"></i>
                </div>
                <h1 class="h4 mb-1 fw-semibold">Create your account</h1>
                <p class="text-muted mb-0">It only takes a minute</p>
              </div>

              <form
                @submit.prevent="handleSignUp"
                novalidate>
                <!-- Email -->
                <div class="mb-3">
                  <label
                    for="email"
                    class="form-label small text-muted"
                    >Email</label
                  >
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-transparent">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input
                      id="email"
                      type="email"
                      class="form-control"
                      placeholder="you@email.com"
                      autocomplete="email"
                      required
                      v-model.trim="form.email" />
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label
                    for="password"
                    class="form-label small text-muted"
                    >Password</label
                  >
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-transparent">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input
                      id="password"
                      type="password"
                      class="form-control"
                      placeholder="Create a strong password"
                      autocomplete="new-password"
                      required
                      v-model.trim="form.password" />
                  </div>
                  <div class="form-text">
                    Use at least 8 characters (letters + numbers is best).
                  </div>
                </div>

                <div
                  v-if="error"
                  class="alert alert-danger py-2 small mb-3">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  {{ error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  :disabled="authStore.isLoading">
                  <span
                    class="spinner-border spinner-border-sm"
                    v-if="authStore.isLoading"></span>
                  <span>{{
                    authStore.isLoading ? "Creating..." : "Create Account"
                  }}</span>
                  <i class="bi bi-arrow-right"></i>
                </button>

                <div class="auth-divider my-4">
                  <span class="text-muted small">or</span>
                </div>

                <div class="d-grid gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-lg">
                    <i class="bi bi-google me-2"></i> Sign up with Google
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-lg">
                    <i class="bi bi-apple me-2"></i> Sign up with Apple
                  </button>
                </div>

                <p class="mt-4 mb-0 text-center small text-muted">
                  Already have an account?
                  <RouterLink
                    class="text-decoration-none fw-semibold"
                    :to="{ name: ROUTE_NAMES.SIGN_IN }"
                    >Sign in</RouterLink
                  >
                </p>
              </form>
            </div>
          </div>

          <p class="text-center text-muted small mt-3 mb-0">
            Tip: use a password manager for stronger passwords.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .auth-card {
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(10px);
  }
  .auth-accent {
    height: 6px;
    background: linear-gradient(90deg, #198754, #0d6efd, #20c997);
  }
  .auth-logo {
    width: 52px;
    height: 52px;
    background: linear-gradient(
      135deg,
      rgba(25, 135, 84, 0.18),
      rgba(13, 110, 253, 0.16)
    );
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  .auth-divider {
    position: relative;
    text-align: center;
  }
  .auth-divider::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
  }
  .auth-divider span {
    position: relative;
    background: rgba(255, 255, 255, 0.92);
    padding: 0 0.75rem;
  }
  .input-group-text {
    border-right: 0;
  }
  .form-control {
    border-left: 0;
  }
  .form-control:focus {
    box-shadow: none;
  }
</style>
<script setup>
  import { ref, reactive } from "vue";
  import { showAlert, showError, showSuccess } from "@/utility/useSwal";
  import { useRouter } from "vue-router";
  import { ROUTE_NAMES } from "@/constants/routeNames";
  import { useAuthStore } from "@/stores/useAuthStore";
  const authStore = useAuthStore();
  const router = useRouter();
  const form = reactive({ email: "", password: "" });
  const error = ref("");
  const handleSignUp = async () => {
    try {
      error.value = "";
      console.log(form);
      await authStore.signUpUser(form.email, form.password);
      showSuccess("Succesfully created account.. redirecting to Sign In");
      router.push({ name: ROUTE_NAMES.SIGN_IN });
    } catch (err) {
      error.value = authStore.firebaseMessage(err);
      return;
    }
  };
</script>
