/**
 * MODELOS PARA PAGOS DE TOKACOINS
 * Tipos e interfaces para el sistema de compra de moneda virtual
 */

import type { TokaPaymentInquiry, TokaRefundInquiry } from '@/services/tokaApi';

/**
 * Paquete de tokacoins disponible para compra
 */
export interface TokaPackage {
  id: string;
  name: string;
  coins: number;
  price: {
    value: string;
    currency: 'MXN' | 'CNY' | 'USD';
  };
  bonus?: number; // Monedas bonus si existen
  popular?: boolean;
  badge?: string; // "MEJOR OFERTA", etc.
}

/**
 * Estado de una transacción de compra de TokaCoins
 */
export interface TokaTransaction {
  id: string;
  paymentId: string;
  userId: string;
  packageId: string;
  coinsAmount: number;
  price: {
    value: number;
    currency: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentStatus?: TokaPaymentInquiry['paymentStatus'];
  createdAt: number;
  completedAt?: number;
  refundId?: string;
  refundStatus?: TokaRefundInquiry['refundStatus'];
}

/**
 * Resultado de una operación de compra
 */
export interface TokenPurchaseResult {
  success: boolean;
  transaction?: TokaTransaction;
  paymentUrl?: string;
  error?: string;
}

/**
 * Historial de transacciones de usuario
 */
export interface TokaUserTransactions {
  userId: string;
  totalSpent: number;
  totalEarned: number;
  transactions: TokaTransaction[];
}

/**
 * Paquetes predefinidos disponibles
 */
export const DEFAULT_TOKA_PACKAGES: TokaPackage[] = [
  {
    id: 'starter',
    name: '💎 Starter',
    coins: 500,
    price: {
      value: '49',
      currency: 'MXN',
    },
  },
  {
    id: 'popular',
    name: '⭐ Popular',
    coins: 1500,
    price: {
      value: '99',
      currency: 'MXN',
    },
    bonus: 200,
    popular: true,
    badge: 'MEJOR OFERTA',
  },
  {
    id: 'champion',
    name: '👑 Champion',
    coins: 3500,
    price: {
      value: '199',
      currency: 'MXN',
    },
    bonus: 500,
  },
  {
    id: 'legend',
    name: '🔥 Legend',
    coins: 8000,
    price: {
      value: '399',
      currency: 'MXN',
    },
    bonus: 1500,
  },
];
