const admin = require("firebase-admin");

let db;

try {
  const serviceAccount = require("./serviceAccountKey.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
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