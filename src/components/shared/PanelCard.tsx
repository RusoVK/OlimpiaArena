import React from 'react';
import { COLORS, DESIGN_CONSTANTS } from '@/theme';
import './PanelCard.css';

interface PanelCardProps {
  children: React.ReactNode;
  title?: string;
  padding?: 'sm' | 'md' | 'lg';
  borderColor?: string;
  borderStyle?: 'thin' | 'medium' | 'thick';
}

export const PanelCard: React.FC<PanelCardProps> = ({
  children,
  title,
  padding = 'md',
  borderColor = COLORS.neon.cyan,
  borderStyle = 'thin',
}) => {
  const paddingMap = {
    sm: '12px',
    md: '16px',
    lg: '24px',
  };

  const borderWidthMap = {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  };

  return (
    <div className="panel-card">
      {title && <h3 className="panel-card-title">{title}</h3>}
      <div
        style={{
          backgroundColor: COLORS.background.night,
          border: `${borderWidthMap[borderStyle]} solid ${borderColor}`,
          borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
          boxShadow: `inset 0 2px 8px rgba(0, 0, 0, 0.5)`,
          padding: paddingMap[padding],
        }}
      >
        {children}
      </div>
    </div>
  );
};
