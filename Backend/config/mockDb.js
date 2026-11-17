// Mock de Firestore en memoria para desarrollo (sin serviceAccountKey.json).
// Soporta: collection().add(), .where(), .orderBy(), .limit(), .get(), doc.data()
// Los datos se pierden al reiniciar el servidor.

const OPERATORS = {
  "==": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "in": (a, b) => Array.isArray(b) && b.includes(a),
  "not-in": (a, b) => Array.isArray(b) && !b.includes(a),
  "array-contains": (a, b) => Array.isArray(a) && a.includes(b),
};

const store = new Map(); // nombre de colección -> Map(id -> data)

const getCollection = (name) => {
  if (!store.has(name)) store.set(name, new Map());
  return store.get(name);
};

const generateId = () => Math.random().toString(36).slice(2, 11);

const compareValues = (a, b) => {
  // Firestore ordena null/undefined antes que cualquier otro valor
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

class MockQuery {
  constructor(collectionName, filters = [], orders = [], limitCount = null) {
    this._name = collectionName;
    this._filters = filters;
    this._orders = orders;
    this._limit = limitCount;
  }

  where(field, op, value) {
    const fn = OPERATORS[op];
    if (!fn) throw new Error(`Mock DB: operador no soportado "${op}"`);
    return new MockQuery(this._name, [...this._filters, { field, fn, value }], this._orders, this._limit);
  }

  orderBy(field, direction = "asc") {
    const dir = direction === "desc" ? -1 : 1;
    return new MockQuery(this._name, this._filters, [...this._orders, { field, dir }], this._limit);
  }

  limit(n) {
    return new MockQuery(this._name, this._filters, this._orders, n);
  }

  async get() {
    let entries = [...getCollection(this._name).entries()];

    for (const { field, fn, value } of this._filters) {
      entries = entries.filter(([, data]) => fn(data[field], value));
    }

    if (this._orders.length) {
      entries.sort(([, a], [, b]) => {
        for (const { field, dir } of this._orders) {
          const cmp = compareValues(a[field], b[field]);
          if (cmp !== 0) return cmp * dir;
        }
        return 0;
      });
    }

    if (this._limit != null) entries = entries.slice(0, this._limit);

    const docs = entries.map(([id, data]) => ({
      id,
      exists: true,
      data: () => structuredClone(data),
    }));
    return { docs, empty: docs.length === 0, size: docs.length };
  }
}

class MockCollection extends MockQuery {
  constructor(name) {
    super(name);
  }

  async add(data) {
    const id = generateId();
    getCollection(this._name).set(id, structuredClone(data));
    return { id };
  }
}

module.exports = {
  collection: (name) => new MockCollection(name),
};
