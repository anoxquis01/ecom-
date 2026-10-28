import { getApps, initializeApp } from "firebase/app";
import { get, getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAfroYmh9OA4wIcieo9w6iIErrxiJ0G7RY",
  authDomain: "ecommerce-393bc.firebaseapp.com",
  databaseURL: "https://ecommerce-393bc-default-rtdb.firebaseio.com",
  projectId: "ecommerce-393bc",
  storageBucket: "ecommerce-393bc.firebasestorage.app",
  messagingSenderId: "730677651084",
  appId: "1:730677651084:web:03cb9fea50ccd62cb4bda9",
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const database = getDatabase(app);
const catalogReference = ref(database, "catalog");

function validateCatalog(catalog) {
  if (
    !catalog ||
    typeof catalog !== "object" ||
    !Array.isArray(catalog.categories) ||
    !Array.isArray(catalog.products) ||
    !catalog.settings
  ) {
    throw new Error("O catálogo recebido do Firebase está incompleto.");
  }
  return catalog;
}

export async function getCatalog() {
  const snapshot = await get(catalogReference);
  if (!snapshot.exists()) {
    throw new Error(
      "O catálogo ainda não foi configurado no Firebase. Execute npm run seed:firebase.",
    );
  }
  return validateCatalog(snapshot.val());
}

export async function saveCatalog(catalog) {
  validateCatalog(catalog);
  await set(catalogReference, catalog);
  return catalog;
}
