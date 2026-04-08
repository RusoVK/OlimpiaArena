/**
 * MODELOS DEL MERCADO DE CANJE
 * Tipos y interfaces para premios, transacciones y usuario
 */

/**
 * Premio disponible en el mercado
 */
export interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number; // Precio en TokaCoins
  category: 'cosmetic' | 'power-up' | 'physical' | 'badge' | 'experience' | 'exclusive';
  categoryLabel?: string; // Etiqueta de categoría (ej: "COSMÉTICOS DE PERFIL")
  icon: string; // Nombre del icono o emoji
  color?: string; // Color de acento (opcional)
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity?: number; // Si es limitado
  image?: string; // URL o base64
  createdAt: Date;
  active: boolean;
}

/**
 * Transacción de canje
 */
export interface Transaction {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  amount: number; // TokaCoins gastados
  type: 'canje' | 'reward' | 'admin-credit'; // Tipo de transacción
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description?: string;
}

/**
 * Información del usuario en el mercado
 */
export interface MarketUser {
  id: string;
  username: string;
  tokaCoins: number; // Balance actual
  inventory: {
    itemId: string;
    name: string;
    quantity: number;
    acquiredAt: Date;
  }[];
  totalSpent: number; // TokaCoins totales gastados
  totalEarned: number; // TokaCoins totales ganados
  level: number;
  lastUpdated: Date;
}

/**
 * Respuesta de una transacción de canje
 */
export interface ChanjeResponse {
  success: boolean;
  message: string;
  newBalance?: number;
  transaction?: Transaction;
  error?: string;
}

/**
 * Estadísticas del usuario
 */
export interface MarketStats {
  totalTransactions: number;
  totalSpent: number;
  totalEarned: number;
  favoriteCategory: string;
  lastTransactionDate: Date | null;
}
