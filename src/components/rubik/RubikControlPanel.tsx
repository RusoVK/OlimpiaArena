import React from 'react';
import { COLORS, DESIGN_CONSTANTS, TYPOGRAPHY } from '@/theme';
import type { RubikMove } from '@/models/rubikModel';
import './RubikControlPanel.css';

interface RubikControlPanelProps {
  onMove: (move: RubikMove) => void;
  onShuffle: () => void;
  onReset: () => void;
  isDisabled?: boolean;
  showUtilityButtons?: boolean;
}

const MOVES: { label: string; move: RubikMove }[] = [
  { label: 'U', move: 'U' },
  { label: "U'", move: "U'" },
  { label: 'D', move: 'D' },
  { label: "D'", move: "D'" },
  { label: 'L', move: 'L' },
  { label: "L'", move: "L'" },
  { label: 'R', move: 'R' },
  { label: "R'", move: "R'" },
  { label: 'F', move: 'F' },
  { label: "F'", move: "F'" },
  { label: 'B', move: 'B' },
  { label: "B'", move: "B'" },
];

export const RubikControlPanel: React.FC<RubikControlPanelProps> = ({
  onMove,
  onShuffle,
  onReset,
  isDisabled = false,
  showUtilityButtons = true,
}) => {
  return (
    <div className={`rubik-control-panel ${isDisabled ? 'is-disabled' : ''}`}>
      <div className="rubik-moves-grid">
        {MOVES.map((item) => (
          <button
            key={item.move}
            className="rubik-move-button"
            onClick={() => onMove(item.move)}
            disabled={isDisabled}
          >
            {item.label}
          </button>
        ))}
      </div>

      {showUtilityButtons && (
        <div className="rubik-utility-buttons">
          <button
            className="rubik-utility-button"
            onClick={onShuffle}
            disabled={isDisabled}
          >
            🔀 Mezclar
          </button>
          <button
            className="rubik-utility-button"
            onClick={onReset}
            disabled={isDisabled}
          >
            ↺ Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};
