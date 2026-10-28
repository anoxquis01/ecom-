import { readFile } from "node:fs/promises";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

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
const catalog = JSON.parse(
  await readFile(new URL("../catalog.seed.json", import.meta.url), "utf8"),
);

await set(ref(database, "catalog"), catalog);
console.log("Catálogo inicial publicado em Realtime Database.");
