/**
 * COMPONENTE: Historial de Transacciones
 * Muestra el historial de canjes y recompensas obtenidas
 */

import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import type { Transaction } from '@/models/market/types';
import { getTransactionHistory } from '@/services/marketAPI';

interface TransactionHistoryProps {
  userId: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    // Recargar historial cada 5 segundos para reflejar cambios en tiempo real
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadHistory = async () => {
    try {
      const history = await getTransactionHistory(userId);
      setTransactions(history);
    } catch (error) {
      console.error('Error loading transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.md,
  };

  const headerStyles: React.CSSProperties = {
    ...TYPOGRAPHY.heading.h4,
    color: COLORS.neon.cyan,
    textShadow: `0 0 8px ${COLORS.neon.cyan}`,
    margin: 0,
    marginBottom: DESIGN_CONSTANTS.spacing.sm,
  };

  const listStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.sm,
    maxHeight: '400px',
    overflowY: 'auto',
  };

  const transactionItemStyles = (): React.CSSProperties => ({
    padding: DESIGN_CONSTANTS.spacing.md,
    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    backgroundColor: COLORS.background.night,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: DESIGN_CONSTANTS.transitions.smooth,
    boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
  });

  const transactionInfoStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: DESIGN_CONSTANTS.spacing.md,
    flex: 1,
  };

  const iconStyles = (): React.CSSProperties => ({
    fontSize: '24px',
    lineHeight: 1,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const detailsStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const itemNameStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.md,
    color: COLORS.text.primary,
    fontWeight: 600,
  };

  const timestampStyles: React.CSSProperties = {
    ...TYPOGRAPHY.body.xs,
    color: COLORS.text.tertiary,
  };

  const amountStyles = (type: string): React.CSSProperties => {
    const isReward = type === 'reward';
    return {
      ...TYPOGRAPHY.mono.md,
      color: isReward ? COLORS.neon.cyan : COLORS.gamification.alertOrange,
      textShadow: isReward ? `0 0 8px ${COLORS.neon.cyan}` : 'none',
      fontWeight: 700,
    };
  };

  const getTransactionIcon = (type: string): string => {
    switch (type) {
      case 'canje':
        return '💎';
      case 'reward':
        return '⭐';
      default:
        return '📝';
    }
  };

  const getAmountText = (transaction: Transaction): string => {
    if (transaction.type === 'reward') {
      return `+${transaction.amount.toLocaleString()}`;
    }
    return `-${transaction.amount.toLocaleString()}`;
  };

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    }

    return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  const emptyStateStyles: React.CSSProperties = {
    padding: DESIGN_CONSTANTS.spacing.lg,
    textAlign: 'center',
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body.md,
  };

  if (loading) {
    return (
      <div style={containerStyles}>
        <h4 style={headerStyles}>📜 Historial de Transacciones</h4>
        <div style={emptyStateStyles}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      <h4 style={headerStyles}>📜 Historial de Transacciones</h4>

      {transactions.length === 0 ? (
        <div style={emptyStateStyles}>
          No hay transacciones aún. ¡Empieza a canjear premios!
        </div>
      ) : (
        <div style={listStyles}>
          {transactions.map((txn) => (
            <div key={txn.id} style={transactionItemStyles()}>
              <div style={transactionInfoStyles}>
                <div style={iconStyles()}>
                  {getTransactionIcon(txn.type)}
                </div>
                <div style={detailsStyles}>
                  <span style={itemNameStyles}>{txn.itemName}</span>
                  <span style={timestampStyles}>
                    {formatDate(txn.timestamp)}
                  </span>
                </div>
              </div>
              <span style={amountStyles(txn.type)}>
                {getAmountText(txn)} Ⓜ️
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
