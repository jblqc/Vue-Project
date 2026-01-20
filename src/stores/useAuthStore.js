import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { db, auth } from "@/utility/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ADMIN_ROLE, USER_ROLE } from "@/constants/appConstants";

export const useAuthStore = defineStore("authStore", () => {
  const user = ref(null);
  const role = ref(null);
  const error = ref(null);
  const isLoading = ref(false);
  const initialized = ref(false);
  const isAuthenticated = computed(() => user.value !== null);
  const isAdmin = computed(() => role.value === ADMIN_ROLE);

  const initializeAuth = () =>
    new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
        if (firebaseUser) {
          user.value = firebaseUser;
          await fetchUserRole(firebaseUser.uid);
        } else {
          clearUser();
        }

        initialized.value = true;
        unsubscribe();
        resolve();
      });
    });

  const fetchUserRole = async uid => {
    const snap = await getDoc(doc(db, "users", uid));
    role.value = snap.exists() ? snap.data().role : null;
  };
  const firebaseMessage = err => {
    const code = err?.code || "";
    if (code === "auth/email-already-in-use")
      return "Email is already registered.";
    if (code === "auth/invalid-email") return "Invalid email format.";
    if (code === "auth/weak-password")
      return "Password should be at least 6 characters.";
    return err?.message || "Sign up failed.";
  };
  const clearUser = () => {
    user.value = null;
    role.value = null;
  };
  const signUpUser = async (email, password) => {
    isLoading.value = true;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        role: USER_ROLE,
        createdAt: new Date(),
      });
      clearUser();
      error.value = null;
    } catch (error) {
      error.value = error.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  const signInUser = async (email, password) => {
    isLoading.value = true;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user.value = userCredential.user;
      error.value = null;
    } catch (error) {
      error.value = error.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  const signOutUser = async () => {
    isLoading.value = true;
    try {
      await signOut(auth);
      clearUser();
      error.value = null;
    } catch (error) {
      error.value = error.message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };
  return {
    user,
    role,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    initialized,
    clearUser,
    signUpUser,
    signInUser,
    signOutUser,
    firebaseMessage,
    initializeAuth,
  };
});
