<template>
  <div class="d-flex align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center g-4">
        <div class="col-12 col-md-9 col-lg-5 col-xl-4">
          <div class="card auth-card border-0 shadow-lg overflow-hidden">
            <!-- Top accent -->
            <div class="auth-accent"></div>

            <div class="card-body p-4 p-md-5">
              <!-- Brand / Header -->
              <div class="text-center mb-4">
                <div
                  class="auth-logo rounded-4 mx-auto d-grid place-items-center mb-3">
                  <i class="bi bi-shield-lock fs-4"></i>
                </div>
                <h1 class="h4 mb-1 fw-semibold">Welcome back</h1>
                <p class="text-muted mb-0">Sign in to continue</p>
              </div>

              <form
                @submit.prevent="handleSignIn"
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
                  <div
                    class="d-flex align-items-center justify-content-between">
                    <label
                      for="password"
                      class="form-label small text-muted mb-0"
                      >Password</label
                    >
                    <a
                      class="small text-decoration-none"
                      href="#"
                      >Forgot?</a
                    >
                  </div>

                  <div class="input-group input-group-lg mt-2">
                    <span class="input-group-text bg-transparent">
                      <i class="bi bi-key"></i>
                    </span>
                    <input
                      id="password"
                      type="password"
                      class="form-control"
                      placeholder="••••••••"
                      autocomplete="current-password"
                      required
                      v-model.trim="form.password" />
                  </div>
                </div>

                <!-- Options -->
                <div
                  class="d-flex align-items-center justify-content-between mb-4">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="rememberMe" />
                    <label
                      class="form-check-label small"
                      for="rememberMe">
                      Remember me
                    </label>
                  </div>

                  <span class="badge text-bg-light border small"
                    >Secure login</span
                  >
                </div>

                <!-- Error -->
                <div
                  v-if="error"
                  class="alert alert-danger py-2 small mb-3">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  {{ error }}
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  class="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                  :disabled="authStore.isLoading">
                  <span
                    class="spinner-border spinner-border-sm"
                    v-if="authStore.isLoading"></span>
                  <span>{{
                    authStore.isLoading ? "Signing in..." : "Sign In"
                  }}</span>
                  <i class="bi bi-arrow-right"></i>
                </button>

                <!-- Divider -->
                <div class="auth-divider my-4">
                  <span class="text-muted small">or</span>
                </div>

                <!-- Social (optional buttons; you can wire later) -->
                <div class="d-grid gap-2">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-lg">
                    <i class="bi bi-google me-2"></i> Continue with Google
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-lg">
                    <i class="bi bi-apple me-2"></i> Continue with Apple
                  </button>
                </div>

                <p class="mt-4 mb-0 text-center small text-muted">
                  Don’t have an account?
                  <RouterLink
                    class="text-decoration-none fw-semibold"
                    :to="{ name: ROUTE_NAMES.SIGN_UP }"
                    >Create one</RouterLink
                  >
                </p>
              </form>
            </div>
          </div>

          <p class="text-center text-muted small mt-3 mb-0">
            By continuing, you agree to our
            <a
              class="text-decoration-none"
              href="#"
              >Terms</a
            >
            &
            <a
              class="text-decoration-none"
              href="#"
              >Privacy</a
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .auth-card {
    border-radius: 1.25rem; /* ~rounded-4 */
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
  const handleSignIn = async () => {
    try {
      error.value = "";
      console.log(form);
      await authStore.signInUser(form.email, form.password);
      showSuccess("Succesfully Logged In");
      router.push({ name: ROUTE_NAMES.HOME });
    } catch (err) {
      error.value = authStore.firebaseMessage(err);
      return;
    }
  };
</script>
