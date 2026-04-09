import React from 'react';
import './StatsGrid.css';

interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 3,
  gap = 'md',
}) => {
  const gapMap = {
    sm: '12px',
    md: '16px',
    lg: '24px',
  };

  return (
    <div
      className="stats-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(140px, 1fr))`,
        gap: gapMap[gap],
      }}
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-item">
          {stat.icon && <div className="stat-icon">{stat.icon}</div>}
          <div className="stat-label">{stat.label}</div>
          <div className="stat-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};
