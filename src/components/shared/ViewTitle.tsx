import React from 'react';
import { COLORS, TYPOGRAPHY } from '@/theme';
import './ViewTitle.css';

interface ViewTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  color?: string;
  hasGlow?: boolean;
}

export const ViewTitle: React.FC<ViewTitleProps> = ({
  children,
  subtitle,
  color = COLORS.neon.cyan,
  hasGlow = true,
}) => {
  return (
    <div className="view-title">
      <h1
        style={{
          ...TYPOGRAPHY.heading.h1,
          color,
          textShadow: hasGlow ? `0 0 16px ${color}` : 'none',
          marginBottom: subtitle ? '8px' : '24px',
        }}
      >
        {children}
      </h1>
      {subtitle && (
        <p
          style={{
            ...TYPOGRAPHY.body.sm,
            color: COLORS.text.secondary,
            marginBottom: '24px',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
