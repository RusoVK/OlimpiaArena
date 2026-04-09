import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import './WalletPanel.css';

interface WalletPanelProps {
  balance: number;
}

export const WalletPanel: React.FC<WalletPanelProps> = ({ balance }) => {
  const walletLabelStyles: React.CSSProperties = {
    ...TYPOGRAPHY.label.sm,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: DESIGN_CONSTANTS.spacing.xs,
  };

  const walletBalanceStyles: React.CSSProperties = {
    ...TYPOGRAPHY.mono.xl,
    color: COLORS.neon.cyan,
    textShadow: `0 0 10px ${COLORS.neon.cyan}`,
    fontWeight: 700,
  };

  return (
    <div className="wallet-panel">
      <div className="wallet-icon">💰</div>
      <div className="wallet-info">
        <div style={walletLabelStyles}>Saldo Disponible</div>
        <div style={walletBalanceStyles}>
          {balance.toLocaleString()} TC
        </div>
      </div>
      <div className="wallet-token">Ⓜ️</div>
    </div>
  );
};
