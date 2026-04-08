/**
 * MARKET API - Mock Service
 * Simula todas las operaciones del mercado de canje
 * Usa localStorage para persistencia
 */

import type { MarketItem, MarketUser, Transaction, ChanjeResponse, MarketStats } from '@/models/market/types';
import marketItemsData from '@/data/marketItems.json';
import mockUserData from '@/data/mockUser.json';

const STORAGE_KEY_USER = 'olimpia_market_user';
const STORAGE_KEY_TRANSACTIONS = 'olimpia_market_transactions';
const STORAGE_KEY_INVENTORY = 'olimpia_market_inventory';

/**
 * Obtiene todos los items disponibles en el mercado
 */
export const getMarketItems = async (): Promise<MarketItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items = marketItemsData.marketItems.map(item => ({
        ...item,
        createdAt: new Date(),
      } as MarketItem));
      resolve(items);
    }, 300); // Simulan latencia de red
  });
};

/**
 * Obtiene un item específico por ID
 */
export const getMarketItem = async (itemId: string): Promise<MarketItem | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = marketItemsData.marketItems.find(i => i.id === itemId);
      if (item) {
        resolve({
          ...item,
          createdAt: new Date(),
        } as MarketItem);
      } else {
        resolve(null);
      }
    }, 200);
  });
};

/**
 * Obtiene los datos del usuario actual
 */
export const getUser = async (): Promise<MarketUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as MarketUser;
        // Convertir strings a Dates si es necesario
        parsed.lastUpdated = new Date(parsed.lastUpdated as any);
        parsed.inventory = parsed.inventory.map(inv => ({
          ...inv,
          acquiredAt: new Date(inv.acquiredAt as any)
        }));
        resolve(parsed);
      } else {
        // Primera vez: usar datos mock
        const mockUser = mockUserData.user as any;
        const user: MarketUser = {
          ...mockUser,
          lastUpdated: new Date(),
          inventory: mockUser.inventory.map((inv: any) => ({
            ...inv,
            acquiredAt: new Date(inv.acquiredAt)
          }))
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        resolve(user);
      }
    }, 200);
  });
};

/**
 * Realiza un canje (compra) de un item
 */
export const chanjeItem = async (
  userId: string,
  itemId: string
): Promise<ChanjeResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Obtener usuario y item
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const userData = storedUser ? JSON.parse(storedUser) as any : mockUserData.user as any;
        const user: MarketUser = {
          ...userData,
          lastUpdated: new Date(userData.lastUpdated),
          inventory: userData.inventory.map((inv: any) => ({
            ...inv,
            acquiredAt: new Date(inv.acquiredAt)
          }))
        };

        const itemData = marketItemsData.marketItems.find(i => i.id === itemId);
        const item: MarketItem | undefined = itemData ? {
          ...itemData as any,
          createdAt: new Date()
        } : undefined;

        if (!item) {
          resolve({
            success: false,
            message: 'Item no encontrado',
            error: 'ITEM_NOT_FOUND',
          });
          return;
        }

        if (!item.active) {
          resolve({
            success: false,
            message: 'Este item no está disponible',
            error: 'ITEM_INACTIVE',
          });
          return;
        }

        if (user.tokaCoins < item.price) {
          resolve({
            success: false,
            message: `No tienes suficientes TokaCoins. Necesitas ${item.price} coins.`,
            error: 'INSUFFICIENT_BALANCE',
          });
          return;
        }

        // Restar coins
        user.tokaCoins -= item.price;
        user.totalSpent += item.price;

        // Agregar a inventario
        const existingItem = user.inventory.find(inv => inv.itemId === itemId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          user.inventory.push({
            itemId,
            name: item.name,
            quantity: 1,
            acquiredAt: new Date(),
          });
        }

        user.lastUpdated = new Date();
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

        // Crear transacción
        const transaction: Transaction = {
          id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          itemId,
          itemName: item.name,
          amount: item.price,
          type: 'canje',
          status: 'completed',
          timestamp: new Date(),
          description: `Canje: ${item.name}`,
        };

        // Guardar transacción
        const transactions = JSON.parse(
          localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]'
        );
        transactions.push(transaction);
        localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));

        resolve({
          success: true,
          message: `¡Has canjeado "${item.name}" exitosamente!`,
          newBalance: user.tokaCoins,
          transaction,
        });
      } catch (error) {
        resolve({
          success: false,
          message: 'Error en el canje',
          error: String(error),
        });
      }
    }, 500); // Simulan transacción más lenta
  });
};

/**
 * Obtiene el historial de transacciones del usuario
 */
export const getTransactionHistory = async (userId: string): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]'
      ) as any[];
      const userTransactions = transactions
        .filter((t: any) => t.userId === userId)
        .map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
      // Ordenar por fecha descendente (más recientes primero)
      resolve(userTransactions.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }, 200);
  });
};

/**
 * Agrega coins al usuario (simulación de recompensa por jugar)
 */
export const addCoinsReward = async (userId: string, amount: number): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const userData = storedUser ? JSON.parse(storedUser) as any : mockUserData.user as any;
      const user: MarketUser = {
        ...userData,
        lastUpdated: new Date(userData.lastUpdated),
        inventory: userData.inventory.map((inv: any) => ({
          ...inv,
          acquiredAt: new Date(inv.acquiredAt)
        }))
      };

      user.tokaCoins += amount;
      user.totalEarned += amount;
      user.lastUpdated = new Date();
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

      // Registrar transacción de recompensa
      const transaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        itemId: 'reward',
        itemName: 'Recompensa por Juego',
        amount,
        type: 'reward',
        status: 'completed',
        timestamp: new Date(),
        description: `+${amount} TokaCoins por completar un desafío`,
      };

      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]'
      );
      transactions.push(transaction);
      localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));

      resolve(user.tokaCoins);
    }, 300);
  });
};

/**
 * Obtiene estadísticas del usuario en el mercado
 */
export const getMarketStats = async (userId: string): Promise<MarketStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transactions = JSON.parse(
        localStorage.getItem(STORAGE_KEY_TRANSACTIONS) || '[]'
      );
      const userTransactions = transactions.filter((t: Transaction) => t.userId === userId);

      const stats: MarketStats = {
        totalTransactions: userTransactions.length,
        totalSpent: userTransactions
          .filter((t: Transaction) => t.type === 'canje')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        totalEarned: userTransactions
          .filter((t: Transaction) => t.type === 'reward')
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
        favoriteCategory: 'cosmetic', // Placeholder
        lastTransactionDate: userTransactions[0]?.timestamp || null,
      };

      resolve(stats);
    }, 200);
  });
};

/**
 * Limpia la base de datos simulada (para testing)
 */
export const resetMarketData = async (): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_INVENTORY);
    resolve();
  });
};
