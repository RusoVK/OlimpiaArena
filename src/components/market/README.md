# 🏪 MERCADO DE CANJE - Documentación

## 📋 Descripción General

El Mercado de Canje es el sistema de monetización virtual dentro de Olimpia Arena. Los usuarios ganan **TokaCoins** completando desafíos de cubo Rubik y pueden canjearlos por premios exclusivos (badges, skins, power-ups, experiencias).

---

## 🗂️ Estructura de Carpetas

```
src/
├── models/market/
│   ├── types.ts          # Interfaces y tipos de datos
│   └── index.ts          # Exportaciones
├── services/
│   └── marketAPI.ts      # Mock APIs (simula backend)
├── components/market/
│   ├── MarketItemCard.tsx       # Card individual de item
│   ├── MarketCatalog.tsx        # Grid del catálogo
│   ├── ChanjeModal.tsx          # Modal de confirmación
│   ├── BalanceHeader.tsx        # Cabecera con balance
│   ├── TransactionHistory.tsx   # Historial de transacciones
│   └── index.ts                 # Exportaciones
├── data/
│   ├── marketItems.json  # Catálogo de premios
│   └── mockUser.json     # Datos del usuario mock
└── views/
    └── MarketView.tsx    # Vista principal del mercado
```

---

## 🔌 Mock APIs (servicios)

Todas las operaciones están simuladas usando `localStorage` para persistencia:

### `getMarketItems()`
Obtiene todos los items disponibles del mercado.

```typescript
const items = await getMarketItems();
```

### `getUser()`
Obtiene los datos del usuario (balance, inventario, estadísticas).

```typescript
const user = await getUser();
console.log(user.tokaCoins); // Balance actual
```

### `chanjeItem(userId, itemId)`
Realiza un canje: rest coins, agrega item al inventario, registra transacción.

```typescript
const response = await chanjeItem('user_001', 'badge_rubik_master');
if (response.success) {
  console.log(`Nuevo balance: ${response.newBalance}`);
}
```

### `getTransactionHistory(userId)`
Obtiene el historial completo de transacciones del usuario (canjes + recompensas).

```typescript
const history = await getTransactionHistory('user_001');
```

### `addCoinsReward(userId, amount)`
Simula ganar coins por completar un desafío. Crea una transacción de tipo `reward`.

```typescript
const newBalance = await addCoinsReward('user_001', 500);
```

### `getMarketStats(userId)`
Obtiene estadísticas del usuario en el mercado (total canjeado, ganado, etc.).

```typescript
const stats = await getMarketStats('user_001');
```

---

## 💾 Persistencia de Datos

### LocalStorage Keys:
- `olimpia_market_user` - Datos del usuario (balance, inventario, nivel)
- `olimpia_market_transactions` - Historial de transacciones
- `olimpia_market_inventory` - Inventario detallado (opcional)

### Datos JSON:
- `src/data/marketItems.json` - Catálogo estático de items
- `src/data/mockUser.json` - Usuario inicial mock

**Nota:** Los datos se sincronizan en `localStorage`. Al recargar la página, se conservan los cambios.

---

## 🎨 Componentes

### `MarketItemCard`
Card individual de un item del mercado.

```typescript
<MarketItemCard
  item={item}
  onSelect={(item) => console.log('Selected:', item)}
  isSelected={true}
/>
```

### `MarketCatalog`
Grid responsivo con filtros por categoría.

```typescript
<MarketCatalog
  onItemSelect={handleSelect}
  selectedItem={selected}
/>
```

Categorías disponibles:
- Badge
- Cosmetic (skins)
- Power-up
- Experience
- Exclusive

### `ChanjeModal`
Modal de confirmación antes de canjear.

```typescript
<ChanjeModal
  item={selectedItem}
  userBalance={1500}
  userId="user_001"
  onCancel={() => setSelected(null)}
  onSuccess={(msg) => console.log(msg)}
  onError={(msg) => console.error(msg)}
/>
```

### `BalanceHeader`
Cabecera con balance de coins del usuario.

```typescript
<BalanceHeader
  username="RusoVK"
  balance={15000}
  level={12}
/>
```

### `TransactionHistory`
Listado de transacciones recientes (canjes + recompensas).

```typescript
<TransactionHistory userId="user_001" />
```

---

## 📊 Tipos de Datos

### `MarketItem`
```typescript
interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;                              // Precio en TokaCoins
  category: 'badge' | 'cosmetic' | 'power-up' | 'experience' | 'exclusive';
  icon: string;                               // Emoji o nombre de icono
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  active: boolean;
}
```

### `MarketUser`
```typescript
interface MarketUser {
  id: string;
  username: string;
  tokaCoins: number;                          // Balance actual
  level: number;
  inventory: Array<{
    itemId: string;
    name: string;
    quantity: number;
    acquiredAt: Date;
  }>;
  totalSpent: number;                         // TokaCoins gastados
  totalEarned: number;                        // TokaCoins ganados
}
```

### `Transaction`
```typescript
interface Transaction {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  amount: number;                             // TokaCoins
  type: 'canje' | 'reward' | 'admin-credit';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}
```

---

## 🎮 Flujo de Canje

1. Usuario selecciona un item del catálogo
2. Se abre modal de confirmación con detalles
3. Usuario confirma el canje
4. `marketAPI.chanjeItem()` valida:
   - Item existe y está activo
   - Usuario tiene suficientes TokaCoins
5. Si es válido:
   - Resta coins del balance
   - Agrega item al inventario
   - Crea transacción en historial
   - Persiste en localStorage
6. Se muestra mensaje de éxito
7. Balance se actualiza en tiempo real

---

## 🧪 Testing / Resetear Datos

Para resetear todos los datos simulados:

```typescript
import { resetMarketData } from '@/services/marketAPI';

await resetMarketData();
```

Esto borra todo del localStorage, permitiendo empezar desde cero.

---

## 📱 Responsivo

Todos los componentes son mobile-first:
- Grid del catálogo se adapta (auto-fill con mínimo 200px)
- Sidebar del historial se oculta en móvil
- Componentes usan variables CSS para spacing responsivo

---

## 🔮 Próximos Pasos

1. **Integración Real**: Reemplazar `localStorage` con APIs reales del backend
2. **Animaciones**: Agregar más transiciones (confetti al canjear, etc.)
3. **Estadísticas Avanzadas**: Dashboard con gráficos de gasto
4. **Sistema de Eventos**: Ofertas especiales, stock limitado, etc.
5. **Gamificación**: Logros por cantidad de canjes, items recogidos, etc.

---

## 📝 Notas

- Todo es **simulado** usando Mock APIs y localStorage
- No hay conexión real con backend (aún)
- Los datos se pierden si se limpia localStorage del navegador
- Las transacciones tienen latencia simulada (200-500ms) para realismo

---

**Olimpia Arena | Mercado de Canje | E-Sports Cognitivos**
