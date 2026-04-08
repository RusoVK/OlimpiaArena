# 🏪 SISTEMA DE MERCADO DE CANJE - DOCUMENTACIÓN COMPLETA

## 📚 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Flujo de Datos](#flujo-de-datos)
4. [Mock APIs](#mock-apis)
5. [Componentes](#componentes)
6. [Tipos de Datos](#tipos-de-datos)
7. [Persistencia](#persistencia)
8. [Guía de Uso](#guía-de-uso)
9. [Ejemplos Prácticos](#ejemplos-prácticos)
10. [Integración con Otras Pantallas](#integración-con-otras-pantallas)
11. [Extensibilidad](#extensibilidad)

---

## 🎯 Visión General

El **Mercado de Canje** es el corazón del sistema de monetización de Olimpia Arena. Permite a los jugadores:

- **Ganar TokaCoins** completando desafíos de Rubik en la Arena
- **Canjear TokaCoins** por premios exclusivos (badges, skins, power-ups, experiencias)
- **Ver historial** completo de transacciones
- **Gestionar inventario** de items comprados

### Características Clave:

✅ Sistema totalmente simulado (Mock APIs)  
✅ Persistencia en localStorage  
✅ Validaciones de balance  
✅ Historial de transacciones en tiempo real  
✅ Interfaz responsiva con diseño Neon-Neuron  
✅ Categorías de premios filtradas  
✅ Modal de confirmación antes de canjear  

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    OLIMPIA ARENA                        │
├─────────────────────────────────────────────────────────┤
│                   MarketView (Pantalla)                 │
│  ┌──────────────────────────────┐  ┌────────────────┐  │
│  │   BalanceHeader              │  │ Transact.      │  │
│  │ (Muestra coins + nivel)      │  │ History        │  │
│  ├──────────────────────────────┤  │ (Sidebar)      │  │
│  │   MarketCatalog              │  │                │  │
│  │ (Grid filtrable de items)    │  └────────────────┘  │
│  │                              │                      │
│  │  ┌──────┬──────┬──────┐     │                      │
│  │  │Card1 │Card2 │Card3 │     │                      │
│  │  │      │      │      │     │                      │
│  │  └──────┴──────┴──────┘     │                      │
│  │                              │                      │
│  └──────────────────────────────┘                      │
│           ▼                                             │
│   ┌─────────────────────┐                              │
│   │  ChanjeModal        │                              │
│   │ (Confirmación)      │                              │
│   └─────────────────────┘                              │
└─────────────────────────────────────────────────────────┘
         ▼ (Llamadas)
┌─────────────────────────────────────────────────────────┐
│           marketAPI (Mock Services)                     │
├─────────────────────────────────────────────────────────┤
│ • getMarketItems()                                      │
│ • getUser()                                             │
│ • chanjeItem()                                          │
│ • getTransactionHistory()                               │
│ • addCoinsReward()                                      │
│ • getMarketStats()                                      │
└─────────────────────────────────────────────────────────┘
         ▼ (Lectura/Escritura)
┌─────────────────────────────────────────────────────────┐
│              localStorage                               │
├─────────────────────────────────────────────────────────┤
│ • olimpia_market_user                                   │
│ • olimpia_market_transactions                           │
│ • olimpia_market_inventory                              │
└─────────────────────────────────────────────────────────┘
         ▼ (Primera vez)
┌─────────────────────────────────────────────────────────┐
│            Datos JSON (Mock)                            │
├─────────────────────────────────────────────────────────┤
│ • marketItems.json (13 premios)                         │
│ • mockUser.json (usuario inicial)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1. **Carga Inicial**

```
App Monta (MarketView)
    ↓
useEffect → loadUser()
    ↓
getUser() verifica localStorage
    ↓
¿Existe datos guardados?
    ├─ Sí → Cargar datos existentes
    └─ No → Cargar mockUser.json → Guardar en localStorage
    ↓
Estado del usuario se actualiza
    ↓
Render con datos en pantalla
```

### 2. **Seleccionar Item**

```
Usuario hace click en Card
    ↓
onSelect(item) → setSelectedItem(item)
    ↓
ChanjeModal aparece con detalles
    ↓
Modal muestra:
  • Nombre y descripción
  • Precio
  • Balance actual de usuario
  • Validación: ¿Tiene suficientes coins?
```

### 3. **Confirmar Canje**

```
Usuario click en "Canjear Ahora"
    ↓
handleChanjeConfirm()
    ↓
chanjeItem(userId, itemId)
    │
    ├─ Validar:
    │  ├─ ¿Item existe?
    │  ├─ ¿Item está activo?
    │  └─ ¿Usuario tiene coins suficientes?
    │
    ├─ Operación:
    │  ├─ Restar coins: user.tokaCoins -= item.price
    │  ├─ Sumar a gastado: user.totalSpent += item.price
    │  ├─ Agregar a inventario o incrementar cantidad
    │  ├─ Guardar user en localStorage
    │  └─ Crear Transaction en localStorage
    │
    └─ Resultado:
       ├─ Success → Mostrar mensaje, recargar datos
       └─ Error → Mostrar mensaje de error
    ↓
Modal cierra
    ↓
UI actualiza con nuevo balance
    ↓
Historial refleja nuevo canje
```

### 4. **Ganar Coins (Desde Arena)**

```
Usuario completa un desafío en Arena
    ↓
Arena llama: addCoinsReward(userId, 500)
    ↓
marketAPI suma coins:
  • user.tokaCoins += 500
  • user.totalEarned += 500
    ↓
Crea Transaction tipo "reward"
    ↓
Persiste en localStorage
    ↓
MarketView re-renderiza con nuevo balance
    ├─ BalanceHeader actualiza
    └─ TransactionHistory muestra nueva entrada
```

---

## 🔌 Mock APIs

### Ubicación: `src/services/marketAPI.ts`

Todas las funciones retornan Promesas con latencia simulada (200-500ms).

#### **1. getMarketItems()**

```typescript
// Obtiene el catálogo completo de premios
const items = await getMarketItems();
// Retorna: MarketItem[]
```

**Qué hace:**
- Lee desde `marketItems.json`
- Filtra solo items activos
- Retorna con latencia simulada (300ms)

**Estructura devuelta:**
```typescript
[
  {
    id: 'badge_rubik_master',
    name: 'Cubo Master',
    description: '...',
    price: 5000,
    category: 'badge',
    icon: '🏆',
    rarity: 'legendary',
    active: true
  },
  // ... más items
]
```

---

#### **2. getUser()**

```typescript
// Obtiene datos del usuario actual
const user = await getUser();
// Retorna: MarketUser
```

**Flujo:**
1. Verifica si existe `olimpia_market_user` en localStorage
2. Si existe → retorna datos guardados
3. Si no existe → carga `mockUser.json` → guarda en localStorage

**Estructura devuelta:**
```typescript
{
  id: 'user_001',
  username: 'RusoVK',
  tokaCoins: 15000,       // Balance actual
  level: 12,
  totalSpent: 8500,       // Total gastado históricamente
  totalEarned: 23500,     // Total ganado históricamente
  inventory: [
    {
      itemId: 'skin_neon_cyan',
      name: 'Cubo Cian Neón',
      quantity: 1,
      acquiredAt: '2026-04-05T10:30:00Z'
    }
    // ... más items en inventario
  ],
  lastUpdated: '2026-04-07T12:00:00Z'
}
```

---

#### **3. chanjeItem(userId, itemId)**

```typescript
// Realiza un canje: resta coins, agrega item, registra transacción
const response = await chanjeItem('user_001', 'badge_rubik_master');
// Retorna: ChanjeResponse
```

**Validaciones:**
- ❌ Item no existe → Error
- ❌ Item inactivo → Error
- ❌ Balance insuficiente → Error con detalle
- ✅ Todo válido → Canje exitoso

**Qué hace:**
1. Obtiene usuario de localStorage
2. Obtiene item del catálogo
3. Valida condiciones (arriba)
4. Si ok:
   - Resta coins: `user.tokaCoins -= item.price`
   - Suma a gastado: `user.totalSpent += item.price`
   - Agrega al inventario (o incrementa cantidad)
   - Guarda usuario en localStorage
   - Crea Transaction
   - Guarda transacción en localStorage

**Respuesta exitosa:**
```typescript
{
  success: true,
  message: '¡Has canjeado "Cubo Master" exitosamente!',
  newBalance: 10000,
  transaction: {
    id: 'txn_1712345678901_abc123',
    userId: 'user_001',
    itemId: 'badge_rubik_master',
    itemName: 'Cubo Master',
    amount: 5000,
    type: 'canje',
    status: 'completed',
    timestamp: '2026-04-07T12:30:00Z'
  }
}
```

**Respuesta error:**
```typescript
{
  success: false,
  message: 'No tienes suficientes TokaCoins. Necesitas 5000 coins.',
  error: 'INSUFFICIENT_BALANCE'
}
```

---

#### **4. getTransactionHistory(userId)**

```typescript
// Obtiene historial de transacciones (canjes + recompensas)
const history = await getTransactionHistory('user_001');
// Retorna: Transaction[]
```

**Características:**
- Filtra transacciones solo del usuario
- Ordena por fecha descendente (más recientes primero)
- Incluye canjes (type: 'canje') y recompensas (type: 'reward')

**Estructura:**
```typescript
[
  {
    id: 'txn_1712345678901_abc123',
    userId: 'user_001',
    itemId: 'badge_rubik_master',
    itemName: 'Cubo Master',
    amount: 5000,
    type: 'canje',                    // 'canje' | 'reward'
    status: 'completed',              // 'pending' | 'completed' | 'failed'
    timestamp: '2026-04-07T12:30:00Z',
    description: 'Canje: Cubo Master'
  },
  // ... más transacciones
]
```

---

#### **5. addCoinsReward(userId, amount)**

```typescript
// Suma coins como recompensa por jugar
const newBalance = await addCoinsReward('user_001', 500);
// Retorna: number (nuevo balance)
```

**Qué hace:**
1. Obtiene usuario de localStorage
2. Suma coins: `user.tokaCoins += amount`
3. Suma a ganado: `user.totalEarned += amount`
4. Guarda usuario
5. Crea Transaction tipo 'reward'
6. Guarda transacción
7. Retorna nuevo balance

**Se usa desde:**
- Arena → Al completar un desafío
- Rankings → Al subir de posición
- Diarios → Al completar quests

---

#### **6. getMarketStats(userId)**

```typescript
// Obtiene estadísticas del usuario en el mercado
const stats = await getMarketStats('user_001');
// Retorna: MarketStats
```

**Estructura:**
```typescript
{
  totalTransactions: 12,           // Canjes + recompensas
  totalSpent: 8500,                // TokaCoins gastados
  totalEarned: 23500,              // TokaCoins ganados
  favoriteCategory: 'cosmetic',    // Categoría más canjeada
  lastTransactionDate: '2026-04-07T12:30:00Z' | null
}
```

---

#### **7. resetMarketData()**

```typescript
// Borra TODOS los datos de localStorage (para testing)
await resetMarketData();
```

⚠️ **Cuidado:** Esto eliminará:
- Datos del usuario
- Historial de transacciones
- Inventario

---

## 🎨 Componentes

### **BalanceHeader**

**Ubicación:** `src/components/market/BalanceHeader.tsx`

**Props:**
```typescript
interface BalanceHeaderProps {
  username: string;
  balance: number;
  level: number;
  isLoading?: boolean;
}
```

**Render:**
```
┌────────────────────────────────────────┐
│ 👤 RusoVK      │     ⭐ Nivel 12       │
│                │  15,000 Ⓜ️ (Glow)    │
└────────────────────────────────────────┘
```

**Características:**
- Borde neón cian con glow
- Balance en fuente monoespaciada (JetBrains Mono)
- Efecto pulse si está cargando
- Responsive

---

### **MarketItemCard**

**Ubicación:** `src/components/market/MarketItemCard.tsx`

**Props:**
```typescript
interface MarketItemCardProps {
  item: MarketItem;
  onSelect: (item: MarketItem) => void;
  isSelected?: boolean;
}
```

**Render:**
```
┌─────────────────────┐
│      🏆            │ ◄─ Icono del item
│  Cubo Master       │ ◄─ Nombre
│  Badge exclusive   │ ◄─ Descripción
│  para maestros...  │
│         ...        │
├─────────────────────┤
│ 5000 Ⓜ️   LEGENDARY │ ◄─ Precio + Rareza
└─────────────────────┘
```

**Características:**
- Seleccionable (click)
- Indica rareza con color
- Glow al pasar mouse si seleccionado
- Opacidad reducida si está inactivo

---

### **MarketCatalog**

**Ubicación:** `src/components/market/MarketCatalog.tsx`

**Props:**
```typescript
interface MarketCatalogProps {
  onItemSelect: (item: MarketItem) => void;
  selectedItem?: MarketItem;
}
```

**Características:**
- Grid responsivo (auto-fill con mín 200px)
- Filtros por categoría (Todo, Badges, Skins, Power-ups, Experiencias, Exclusivas)
- Scroll horizontal en categorías
- Carga inicial con latencia simulada
- Estado vacío si no hay items

**Estructura de filtros:**
```
[📦 Todo] [🏆 Badges] [🎨 Skins] [⚡ Power-ups] [🚀 Experiencias] [👑 Exclusivas]
```

---

### **ChanjeModal**

**Ubicación:** `src/components/market/ChanjeModal.tsx`

**Props:**
```typescript
interface ChanjeModalProps {
  item: MarketItem;
  userBalance: number;
  userId: string;
  onCancel: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}
```

**Render:**
```
┌────────────────────────────────────┐
│   Confirmar Canje                  │
│           🏆                       │
├────────────────────────────────────┤
│ Producto:     Cubo Master          │
│ Precio:       5000 Ⓜ️              │
│ Tu Balance:   15,000 Ⓜ️ ✅         │
├────────────────────────────────────┤
│ [Cancelar]      [✨ Canjear Ahora] │
└────────────────────────────────────┘
```

**Características:**
- Modal overlay con blur
- Animación slideInDown
- Validación en tiempo real
- Botón "Canjear" deshabilitado si no hay coins
- Muestra advertencia si balance insuficiente
- Estados de carga: "⏳ Procesando..."

---

### **TransactionHistory**

**Ubicación:** `src/components/market/TransactionHistory.tsx`

**Props:**
```typescript
interface TransactionHistoryProps {
  userId: string;
}
```

**Render:**
```
📜 Historial de Transacciones

┌────────────────────────┐
│ 💎 Cubo Master        │ -5000 Ⓜ️
│ hace 5 minutos        │
├────────────────────────┤
│ ⭐ Recompensa         │ +500 Ⓜ️
│ hace 2 horas          │
├────────────────────────┤
│ 💎 Booster XP 24H     │ -1200 Ⓜ️
│ ayer                  │
└────────────────────────┘
```

**Características:**
- Máximo 400px de altura (scroll interno)
- Ordena por fecha (recientes primero)
- Icono depenede del tipo (💎 canje, ⭐ recompensa)
- Color diferente para canje vs recompensa
- Timestamp relativo (hace X horas)
- Auto-refresca cada 5 segundos
- Muestra estado vacío si no hay transacciones

---

## 📊 Tipos de Datos

### **MarketItem**
```typescript
interface MarketItem {
  id: string;                           // Identificador único
  name: string;                         // Nombre del premio
  description: string;                  // Descripción breve
  price: number;                        // Precio en TokaCoins
  category: 'badge' | 'cosmetic' | 'power-up' | 'experience' | 'exclusive';
  icon: string;                         // Emoji o icono visual
  color?: string;                       // Color de acento (hex)
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity?: number;                    // Si es limitado
  image?: string;                       // URL o base64 (futuro)
  createdAt: Date;                      // Fecha de creación
  active: boolean;                      // ¿Disponible para canje?
}
```

---

### **MarketUser**
```typescript
interface MarketUser {
  id: string;                           // ID único del usuario
  username: string;                     // Nombre de usuario
  tokaCoins: number;                    // Balance actual
  level: number;                        // Nivel del usuario
  inventory: {
    itemId: string;
    name: string;
    quantity: number;                   // Cantidad poseída
    acquiredAt: Date;                   // Cuándo lo compró
  }[];
  totalSpent: number;                   // TokaCoins gastados históricos
  totalEarned: number;                  // TokaCoins ganados históricos
  lastUpdated: Date;                    // Última actualización
}
```

---

### **Transaction**
```typescript
interface Transaction {
  id: string;                           // ID único de transacción
  userId: string;                       // ID del usuario
  itemId: string;                       // ID del item (o 'reward')
  itemName: string;                     // Nombre del item
  amount: number;                       // Cantidad de coins
  type: 'canje' | 'reward' | 'admin-credit';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;                      // Cuándo ocurrió
  description?: string;                 // Descripción adicional
}
```

---

### **ChanjeResponse**
```typescript
interface ChanjeResponse {
  success: boolean;
  message: string;                      // Mensaje para mostrar
  newBalance?: number;                  // Si fue exitoso
  transaction?: Transaction;            // Detalles de la transacción
  error?: string;                       // Código de error
}
```

---

### **MarketStats**
```typescript
interface MarketStats {
  totalTransactions: number;            // Cantidad de transacciones
  totalSpent: number;                   // Coins gastados
  totalEarned: number;                  // Coins ganados
  favoriteCategory: string;             // Categoría más comprada
  lastTransactionDate: Date | null;     // Última transacción
}
```

---

## 💾 Persistencia

### **LocalStorage Keys**

| Key | Contenido | Tipo |
|-----|-----------|------|
| `olimpia_market_user` | Datos del usuario actual | JSON |
| `olimpia_market_transactions` | Historial de transacciones | JSON Array |
| `olimpia_market_inventory` | Inventario detallado (futuro) | JSON Array |

**Ejemplo de valores guardados:**

```json
// olimpia_market_user
{
  "id": "user_001",
  "username": "RusoVK",
  "tokaCoins": 10000,
  "level": 12,
  "inventory": [
    {
      "itemId": "skin_neon_cyan",
      "name": "Cubo Cian Neón",
      "quantity": 1,
      "acquiredAt": "2026-04-05T10:30:00Z"
    }
  ],
  "totalSpent": 8500,
  "totalEarned": 23500,
  "lastUpdated": "2026-04-07T12:30:00Z"
}
```

```json
// olimpia_market_transactions
[
  {
    "id": "txn_1712345678901_abc123",
    "userId": "user_001",
    "itemId": "badge_rubik_master",
    "itemName": "Cubo Master",
    "amount": 5000,
    "type": "canje",
    "status": "completed",
    "timestamp": "2026-04-07T12:30:00Z"
  },
  {
    "id": "txn_1712345600000_def456",
    "userId": "user_001",
    "itemId": "reward",
    "itemName": "Recompensa por Juego",
    "amount": 500,
    "type": "reward",
    "status": "completed",
    "timestamp": "2026-04-07T11:00:00Z"
  }
]
```

### **Ciclo de Vida de Datos**

```
App Inicia
├── localStorage vacío?
│   ├─ Sí → Cargar mockUser.json + mockUser.json
│   │       ↓ Guardar en localStorage
│   └─ No → Leer de localStorage
│
├── Usuario interactúa (canje)
│   ├─ Modificar tokaCoins
│   ├─ Modificar inventario
│   ├─ Crear Transaction
│   └─ Guardar ambos en localStorage
│
└── Recargar página
    └── localStorage persiste ✅
```

---

## 📖 Guía de Uso

### **Integración en MarketView**

```typescript
import { getUser, chanjeItem } from '@/services/marketAPI';

export const MarketView: React.FC = () => {
  const [user, setUser] = useState<MarketUser | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    loadUser();
  }, []);

  const handleChanjeSuccess = (message: string) => {
    // Recargar datos del usuario para reflejar nuevo balance
    loadUser();
  };

  return (
    <>
      {user && <BalanceHeader {...user} />}
      <MarketCatalog onItemSelect={setSelectedItem} />
      {selectedItem && user && (
        <ChanjeModal
          item={selectedItem}
          userBalance={user.tokaCoins}
          userId={user.id}
          onCancel={() => setSelectedItem(null)}
          onSuccess={handleChanjeSuccess}
          onError={(msg) => console.error(msg)}
        />
      )}
    </>
  );
};
```

---

## 🔧 Ejemplos Prácticos

### **Ejemplo 1: Ganar Coins Después de Completar Arena**

```typescript
// En ArenaView.tsx - Al terminar un desafío
import { addCoinsReward } from '@/services/marketAPI';

const handleSolveComplete = async (timeSeconds: number) => {
  const rewardAmount = Math.max(100, Math.round(1000 / timeSeconds)); // Menos tiempo = más coins
  
  const newBalance = await addCoinsReward('user_001', rewardAmount);
  
  console.log(`¡Ganaste ${rewardAmount} TokaCoins!`);
  console.log(`Nuevo balance: ${newBalance}`);
  
  // Mostrar notificación
  showNotification(`+${rewardAmount} Ⓜ️`);
};
```

---

### **Ejemplo 2: Verificar Balance Antes de Canje**

```typescript
// Validación custom
const canAfford = async (userId: string, itemPrice: number): Promise<boolean> => {
  const user = await getUser();
  return user.tokaCoins >= itemPrice;
};

// Uso
const canBuy = await canAfford('user_001', 5000);
if (!canBuy) {
  alert('No tienes suficientes coins. ¡Juega más para ganar!');
}
```

---

### **Ejemplo 3: Dashboard de Estadísticas**

```typescript
// Dashboard.tsx
import { getMarketStats } from '@/services/marketAPI';

const Dashboard: React.FC<{userId: string}> = ({ userId }) => {
  const [stats, setStats] = useState<MarketStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const marketStats = await getMarketStats(userId);
      setStats(marketStats);
    };
    loadStats();
  }, [userId]);

  if (!stats) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Tu Actividad en el Mercado</h2>
      <p>📊 Transacciones: {stats.totalTransactions}</p>
      <p>💰 Gastado: {stats.totalSpent.toLocaleString()} Ⓜ️</p>
      <p>🎁 Ganado: {stats.totalEarned.toLocaleString()} Ⓜ️</p>
      <p>🏆 Favorito: {stats.favoriteCategory}</p>
      <p>📅 Última compra: {stats.lastTransactionDate ? new Date(stats.lastTransactionDate).toLocaleDateString() : 'Nunca'}</p>
    </div>
  );
};
```

---

### **Ejemplo 4: Filtrar Transacciones por Tipo**

```typescript
// Histórico de solo canjes (sin recompensas)
const getSpendingHistory = async (userId: string) => {
  const history = await getTransactionHistory(userId);
  return history.filter(t => t.type === 'canje');
};

// Histórico de solo recompensas
const getRewardsHistory = async (userId: string) => {
  const history = await getTransactionHistory(userId);
  return history.filter(t => t.type === 'reward');
};
```

---

## 🔗 Integración con Otras Pantallas

### **Arena → Mercado (Flujo de Ganancias)**

```
┌─────────────────┐
│   Arena View    │
│                 │
│ Resolver Cubo   │
│ ✅ Completado   │
└────────┬────────┘
         │
         │ handleSolveComplete(15.2s)
         │
         ▼
    addCoinsReward(userId, 500)
         │
         ▼
┌─────────────────┐
│  Market Update  │
│ Balance: 15,500 │
│  Historia: +500 │
└─────────────────┘
```

---

### **Perfil → Mercado (Ver Inventario)**

```typescript
// En ProfileView.tsx
import { getUser } from '@/services/marketAPI';

const ProfileView: React.FC = () => {
  const [user, setUser] = useState<MarketUser | null>(null);

  useEffect(() => {
    const load = async () => setUser(await getUser());
    load();
  }, []);

  return (
    <div>
      <h2>Mi Inventario</h2>
      {user?.inventory.map(item => (
        <div key={item.itemId}>
          <span>{item.name}</span>
          <span>x{item.quantity}</span>
          <small>Desde: {new Date(item.acquiredAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
};
```

---

### **Ranking → Mercado (Bonus por Posición)**

```typescript
// En RankingView.tsx
const handleRankingUpdate = async (newRank: number) => {
  if (newRank === 1) {
    // Bonus: 1000 coins por ser #1
    await addCoinsReward('user_001', 1000);
    showNotification('🏆 ¡Eres #1! +1000 Ⓜ️');
  } else if (newRank <= 10) {
    // Bonus: 200 coins por top 10
    await addCoinsReward('user_001', 200);
  }
};
```

---

## 🚀 Extensibilidad

### **Agregar Nuevos Premios**

1. **Editar `marketItems.json`:**
```json
{
  "id": "badge_new_prize",
  "name": "Nuevo Premio",
  "description": "Descripción del premio",
  "price": 2500,
  "category": "badge",
  "icon": "🎯",
  "rarity": "rare",
  "active": true
}
```

2. **Sistema ya lo detecta automáticamente** ✅

---

### **Agregar Nuevas Categorías**

1. **En `types.ts`, actualizar:**
```typescript
category: 'badge' | 'cosmetic' | 'power-up' | 'experience' | 'exclusive' | 'NEW_CATEGORY';
```

2. **En `MarketCatalog.tsx`, agregar al array:**
```typescript
const categories = [
  // ... existentes
  { id: 'new_category', label: 'Nueva', icon: '🎁' },
];
```

---

### **Integrar API Real**

```typescript
// Reemplazar marketAPI.ts funciones con llamadas reales:

export const getMarketItems = async (): Promise<MarketItem[]> => {
  const response = await fetch('https://api.olimpia.com/market/items');
  return response.json();
};

export const chanjeItem = async (userId: string, itemId: string): Promise<ChanjeResponse> => {
  const response = await fetch('https://api.olimpia.com/market/canje', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, itemId })
  });
  return response.json();
};

// ... resto de funciones
```

---

### **Agregar Sistema de Ofertas Especiales**

```typescript
// marketAPI.ts
interface SpecialOffer extends MarketItem {
  discountPercentage: number;
  endsAt: Date;
}

export const getSpecialOffers = async (): Promise<SpecialOffer[]> => {
  // Lógica para ofertas con descuento temporal
};
```

---

## 📝 Resumen

### **Flujo General:**

```
Usuario abre Mercado
    ↓
Carga balance + historial
    ↓
Ve catálogo de premios
    ↓
Selecciona un item
    ↓
Modal de confirmación
    ↓
¿Confirma?
├─ Sí → Canje
│   ├─ Resta coins
│   ├─ Guarda transacción
│   ├─ Actualiza UI
│   └─ Muestra éxito
└─ No → Cierra modal
```

### **Claves del Sistema:**

| Aspecto | Solución |
|---------|----------|
| **Persistencia** | localStorage |
| **Validaciones** | Antes de chanjar |
| **Real-time** | Auto-refresh cada 5s |
| **Responsivo** | CSS Grid adaptable |
| **Diseño** | Neon-Neuron (Toka) |
| **Tipado** | TypeScript strict |
| **Simulación** | Mock APIs con latencia |

---

## 🎯 Próximas Fases

- [ ] Conectar con API real del backend
- [ ] Sistema de ofertas limitadas
- [ ] Loot boxes/cajas aleatorias
- [ ] Trading entre usuarios
- [ ] Eventos especiales con premios exclusivos
- [ ] Estadísticas avanzadas (gráficos)
- [ ] Sistema de suscripción (VIP)

---

**Documento completo del Sistema de Mercado de Canje - Olimpia Arena**
