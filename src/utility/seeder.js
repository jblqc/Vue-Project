import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utility/firebaseConfig";
import { generateProducts } from "@/utility/fakeProducts";

export const seedProducts = async count => {
  const batch = writeBatch(db);
  const products = generateProducts(count);

  products.forEach(product => {
    const ref = doc(collection(db, "products"));
    batch.set(ref, {
      ...product,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();
};
