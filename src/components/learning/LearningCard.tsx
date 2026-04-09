import React from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { PanelCard } from '@/components/shared';
import './LearningCard.css';

interface LearningCardProps {
  badge: string;
  badgeColor?: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const LearningCard: React.FC<LearningCardProps> = ({
  badge,
  badgeColor = COLORS.neon.teal,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: DESIGN_CONSTANTS.transitions.smooth,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${COLORS.neon.cyan}80`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }
      }}
    >
      <PanelCard>
        <span
          className="learning-badge"
          style={{ borderColor: badgeColor, color: badgeColor }}
        >
          {badge}
        </span>
        <h3 style={{ ...TYPOGRAPHY.heading.h4, margin: 0, marginTop: '8px' }}>
          {title}
        </h3>
        <p style={{ ...TYPOGRAPHY.body.md, color: COLORS.text.secondary, margin: 0 }}>
          {description}
        </p>
      </PanelCard>
    </div>
  );
};
