import React from 'react';
import { COLORS, DESIGN_CONSTANTS } from '@/theme';
import './MarketMessages.css';

interface MarketMessagesProps {
  successMessage?: string | null;
  errorMessage?: string | null;
}

export const MarketMessages: React.FC<MarketMessagesProps> = ({
  successMessage,
  errorMessage,
}) => {
  if (!successMessage && !errorMessage) return null;

  if (successMessage) {
    return (
      <div className="market-message market-message-success">
        ✅ {successMessage}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="market-message market-message-error">
        ⚠️ {errorMessage}
      </div>
    );
  }

  return null;
};
