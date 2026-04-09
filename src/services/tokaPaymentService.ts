/**
 * SERVICIO DE PAGOS TOKA
 * Maneja la creación, ejecución y seguimiento de pagos de TokaCoins
 */

import { createPayment, inquirePayment, refundPayment, inquireRefund, executePayment } from './tokaApi';
import type { AlipaySession } from './alipayAuth';
import type { TokaTransaction, TokaPackage } from '@/models/market/tokaPay-types';

const TRANSACTIONS_STORAGE_KEY = 'toka_transactions';

/**
 * Crea una transacción de compra de TokaCoins
 */
export const initiatePurchase = async (
  session: AlipaySession,
  pkg: TokaPackage
): Promise<{ paymentUrl: string; transaction: TokaTransaction } | null> => {
  try {
    // Crear orden en Toka API
    const payload = {
      userId: session.userId,
      orderTitle: `TokaCoins - ${pkg.name}`,
      orderAmount: {
        value: pkg.price.value,
        currency: pkg.price.currency,
      },
    };

    const response = await createPayment(payload, session.accessToken);

    if (!response.success || !response.data) {
      console.error('Error creando pago:', response.message);
      return null;
    }

    // Crear objeto de transacción
    const transaction: TokaTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      paymentId: response.data.paymentId,
      userId: session.userId,
      packageId: pkg.id,
      coinsAmount: pkg.coins + (pkg.bonus || 0),
      price: {
        value: parseInt(pkg.price.value),
        currency: pkg.price.currency,
      },
      status: 'pending',
      paymentStatus: 'PENDING',
      createdAt: Date.now(),
    };

    // Guardar transacción
    saveTransaction(transaction);

    return {
      paymentUrl: response.data.paymentUrl,
      transaction,
    };
  } catch (error) {
    console.error('Error iniciando compra:', error);
    return null;
  }
};

/**
 * Ejecuta el pago mediante el bridge de Alipay
 */
export const executePurchasePayment = async (paymentUrl: string): Promise<boolean> => {
  try {
    return await executePayment(paymentUrl);
  } catch (error) {
    console.error('Error ejecutando pago:', error);
    return false;
  }
};

/**
 * Verifica el estado de un pago
 */
export const checkPaymentStatus = async (
  paymentId: string,
  accessToken: string
): Promise<string> => {
  try {
    const response = await inquirePayment(paymentId, accessToken);

    if (!response.success) {
      console.error('Error consultando pago:', response.message);
      return 'failed';
    }

    return response.data.paymentStatus || 'unknown';
  } catch (error) {
    console.error('Error verificando status:', error);
    return 'unknown';
  }
};

/**
 * Actualiza el estado de una transacción basado en consulta a Toka
 */
export const updateTransactionStatus = async (
  transaction: TokaTransaction,
  accessToken: string
): Promise<TokaTransaction | null> => {
  try {
    const status = await checkPaymentStatus(transaction.paymentId, accessToken);

    const updated = { ...transaction, paymentStatus: status as any };

    if (status === 'SUCCESS') {
      updated.status = 'completed';
      updated.completedAt = Date.now();
    } else if (status === 'FAILED' || status === 'CLOSED') {
      updated.status = 'failed';
    }

    updateTransactionStorage(updated);
    return updated;
  } catch (error) {
    console.error('Error actualizando transacción:', error);
    return null;
  }
};

/**
 * Solicita un reembolso
 */
export const requestRefund = async (
  transaction: TokaTransaction,
  session: AlipaySession
): Promise<string | null> => {
  try {
    const response = await refundPayment(
      {
        userId: session.userId,
        paymentId: transaction.paymentId,
        refundAmount: {
          value: transaction.price.value.toString(),
          currency: transaction.price.currency,
        },
      },
      session.accessToken
    );

    if (!response.success) {
      console.error('Error reembolsando:', response.message);
      return null;
    }

    // Guardar ID de reembolso en transacción
    const updated = {
      ...transaction,
      refundId: response.data.refundId,
      refundStatus: 'PENDING' as const,
    };

    updateTransactionStorage(updated);
    return response.data.refundId;
  } catch (error) {
    console.error('Error solicitando reembolso:', error);
    return null;
  }
};

/**
 * Verifica el estado de un reembolso
 */
export const checkRefundStatus = async (
  refundId: string,
  accessToken: string
): Promise<string> => {
  try {
    const response = await inquireRefund(refundId, accessToken);

    if (!response.success) {
      console.error('Error consultando reembolso:', response.message);
      return 'unknown';
    }

    return response.data.refundStatus || 'unknown';
  } catch (error) {
    console.error('Error verificando reembolso:', error);
    return 'unknown';
  }
};

/**
 * Obtiene todas las transacciones del usuario
 */
export const getUserTransactions = (): TokaTransaction[] => {
  try {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    return [];
  }
};

/**
 * Obtiene una transacción específica
 */
export const getTransaction = (transactionId: string): TokaTransaction | null => {
  try {
    const transactions = getUserTransactions();
    return transactions.find((t) => t.id === transactionId) || null;
  } catch (error) {
    console.error('Error obteniendo transacción:', error);
    return null;
  }
};

/**
 * Guarda una nueva transacción
 */
export const saveTransaction = (transaction: TokaTransaction): void => {
  try {
    const transactions = getUserTransactions();
    transactions.push(transaction);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error guardando transacción:', error);
  }
};

/**
 * Actualiza una transacción existente
 */
export const updateTransactionStorage = (transaction: TokaTransaction): void => {
  try {
    const transactions = getUserTransactions();
    const index = transactions.findIndex((t) => t.id === transaction.id);

    if (index !== -1) {
      transactions[index] = transaction;
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    }
  } catch (error) {
    console.error('Error actualizando transacción:', error);
  }
};

/**
 * Limpia el historial de transacciones (solo en desarrollo)
 */
export const clearTransactionHistory = (): void => {
  try {
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando historial:', error);
  }
};
