const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let db;

try {
  const serviceAccount = require("./serviceAccountKey.json");
  const app = initializeApp({
    credential: cert(serviceAccount)
  });
  db = getFirestore(app);
  console.log("✓ Firebase conectado");
} catch (error) {
  console.warn("⚠ Firebase no disponible, usando mock", error.message);
  // Mock database para desarrollo
  db = {
    collection: function(name) {
      return {
        add: async (data) => ({ id: Math.random().toString(36).substr(2, 9) }),
        get: async () => ({ docs: [] }),
      };
    }
  };
}

module.exports = db;