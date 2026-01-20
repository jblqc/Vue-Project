import { db } from "@/utility/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const productsCollection = collection(db, "products");
export default {
  async createProduct(productData) {
    const productSnap = await addDoc(productsCollection, productData);
    return { id: productSnap.id, ...productData };
  },
  async getAllProducts() {
    const productSnap = await getDocs(productsCollection);
    return productSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  async getProduct(productId) {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    return { id: productSnap.id, ...productSnap.data() };
  },
  async updateProduct(productId, productData) {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, productData);
    return {
      id: productId,
      ...productData,
    };
  },
  async deleteProduct(productId) {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
  },
};
