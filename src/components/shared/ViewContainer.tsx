import React from 'react';
import { COLORS } from '@/theme';
import './ViewContainer.css';

interface ViewContainerProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
}

export const ViewContainer: React.FC<ViewContainerProps> = ({
  children,
  padding = 'lg',
  backgroundColor = COLORS.background.abyss,
}) => {
  const paddingMap = {
    sm: '16px',
    md: '20px',
    lg: '24px 16px 100px',
  };

  return (
    <div
      className="view-container"
      style={{
        padding: paddingMap[padding],
        backgroundColor,
      }}
    >
      {children}
    </div>
  );
};
