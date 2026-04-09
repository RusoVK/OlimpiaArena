/**
 * OLIMPIA ARENA - Pantalla Arcade
 * Mapa de niveles con progresion tipo Duolingo
 * Con sistema de Game Over, Promo y Compra de movimientos
 */

import React, { useEffect, useMemo, useState } from 'react';
import { COLORS, DESIGN_CONSTANTS } from '@/theme';
import { BalanceHeader } from '@/components/market/BalanceHeader';
import { chanjeItem, getMarketItems, getUser } from '@/services/marketAPI';
import type { MarketItem, MarketUser } from '@/models/market/types';
import { useRubikController } from '@/controllers/useRubikController';
import type { RubikMove } from '@/models/rubikModel';
import RubikView from './RubikView';
import {
  ArcadePlayHeader,
  ArcadeMapHeader,
  ArcadePlayStats,
  ArcadeShopPanel,
  ArcadeMap,
  ArcadeMessages,
  ArcadeGameOverModal,
  ArcadePromoModal,
  ArcadeOverlay,
} from '@/components/arcade';
import levelsData from '@/data/arcadeLevels.json';

interface ArcadeLevel {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starsRequired: number;
  starsEarned: number;
  maxStars: number;
  unlocked: boolean;
  goal: string;
  moveLimit: number;
  scramble: RubikMove[];
}

const difficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return COLORS.neon.teal;
    case 'medium':
      return COLORS.neon.cyan;
    case 'hard':
      return COLORS.gamification.alertOrange;
    default:
      return COLORS.text.secondary;
  }
};

const GAME_OVER_MOVES_PRICE = 500;
const PROMO_MOVES_COUNT = 20;
const EXIT_BLOCK_TIME = 10000; // 10 segundos
const PROMO_DELAY = 5000; // 5 segundos

export const ArcadeView: React.FC = () => {
  const levels = levelsData as ArcadeLevel[];
  const totalStars = levels.reduce((sum, level) => sum + level.starsEarned, 0);
  const maxStars = levels.reduce((sum, level) => sum + level.maxStars, 0);
  const [user, setUser] = useState<MarketUser | null>(null);
  const [shopItems, setShopItems] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeLevelId, setActiveLevelId] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [extraMoves, setExtraMoves] = useState(0);
  const [originalMoveLimit, setOriginalMoveLimit] = useState(0);
  const rubikController = useRubikController();

  // Estados para Game Over y Promo
  const [isGameOver, setIsGameOver] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [exitBlocked, setExitBlocked] = useState(false);
  const [isBuyingMoves, setIsBuyingMoves] = useState(false);

  useEffect(() => {
    const loadArcadeData = async () => {
      setIsLoading(true);
      try {
        const [userData, marketItems] = await Promise.all([
          getUser(),
          getMarketItems(),
        ]);
        const arcadeItemIds = new Set(['arcade_hint_basic', 'arcade_hint_plus', 'arcade_coach_flash']);
        setUser(userData);
        setShopItems(marketItems.filter((item) => arcadeItemIds.has(item.id)));
      } catch (error) {
        console.error('Error cargando arcade:', error);
        setErrorMessage('No se pudo cargar el Arcade');
      } finally {
        setIsLoading(false);
      }
    };

    loadArcadeData();
  }, []);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return undefined;
    const timer = setTimeout(() => setErrorMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    // Detectar Game Over usando valores derivados
    const currentMoveLimit = (activeLevelId && originalMoveLimit) ? originalMoveLimit + extraMoves : 0;
    const currentRemaining = currentMoveLimit > 0 ? Math.max(0, currentMoveLimit - moveCount) : 0;
    
    if (activeLevelId && currentRemaining === 0 && !isGameOver && originalMoveLimit > 0) {
      setIsGameOver(true);
      
      // Mostrar promo después de 5 segundos
      const promoTimer = setTimeout(() => {
        setShowPromo(true);
      }, PROMO_DELAY);

      return () => clearTimeout(promoTimer);
    }
  }, [moveCount, extraMoves, activeLevelId, isGameOver, originalMoveLimit]);

  const refreshUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const handlePurchase = async (itemId: string) => {
    if (!user) return;
    const response = await chanjeItem(user.id, itemId);
    if (response.success) {
      setSuccessMessage(response.message);
      refreshUser();
    } else {
      setErrorMessage(response.message || 'No se pudo completar la compra');
    }
  };

  const handleBuyMovesFromGameOver = async () => {
    if (!user) return;
    
    setIsBuyingMoves(true);
    const response = await chanjeItem(user.id, 'arcade_extra_moves_10');
    
    if (response.success) {
      setSuccessMessage('¡Compraste 10 movimientos extra!');
      setExtraMoves((prev) => prev + 10);
      setIsGameOver(false);
      setShowPromo(false);
      refreshUser();
    } else {
      setErrorMessage(response.message || 'No se pudo comprar los movimientos');
    }
    
    setIsBuyingMoves(false);
  };

  const handleBuyPromo = async () => {
    if (!user) return;
    
    setIsBuyingMoves(true);
    const response = await chanjeItem(user.id, 'arcade_extra_moves_20_promo');
    
    if (response.success) {
      setSuccessMessage('¡Obtuviste 20 movimientos con la promo!');
      setExtraMoves((prev) => prev + PROMO_MOVES_COUNT);
      setIsGameOver(false);
      setShowPromo(false);
      refreshUser();
    } else {
      setErrorMessage(response.message || 'No se pudo completar la compra de la promo');
    }
    
    setIsBuyingMoves(false);
  };

  const handleCancelGameOver = () => {
    setExitBlocked(true);
    const timer = setTimeout(() => {
      setExitBlocked(false);
    }, EXIT_BLOCK_TIME);

    return () => clearTimeout(timer);
  };

  const handleExitLevel = () => {
    if (exitBlocked) return;
    exitLevel();
  };

  const activeLevel = useMemo(
    () => levels.find((level) => level.id === activeLevelId) || null,
    [activeLevelId, levels]
  );

  const totalMoveLimit = activeLevel
    ? originalMoveLimit + extraMoves
    : 0;

  const remainingMoves = activeLevel
    ? Math.max(0, totalMoveLimit - moveCount)
    : 0;

  // Detectar Game Over
  useEffect(() => {
    if (activeLevelId && remainingMoves === 0 && !isGameOver) {
      setIsGameOver(true);
      
      // Mostrar promo después de 5 segundos
      const promoTimer = setTimeout(() => {
        setShowPromo(true);
      }, PROMO_DELAY);

      return () => clearTimeout(promoTimer);
    }
  }, [remainingMoves, activeLevelId, isGameOver]);

  const startLevel = (level: ArcadeLevel) => {
    setActiveLevelId(level.id);
    setOriginalMoveLimit(level.moveLimit);
    setMoveCount(0);
    setExtraMoves(0);
    setIsGameOver(false);
    setShowPromo(false);
    setExitBlocked(false);
    rubikController.onReset();
    rubikController.onBatch(level.scramble);
  };

  const exitLevel = () => {
    setActiveLevelId(null);
    setMoveCount(0);
    setExtraMoves(0);
    setIsGameOver(false);
    setShowPromo(false);
    setExitBlocked(false);
    rubikController.onReset();
  };

  const handleRestart = () => {
    if (!activeLevel) return;
    startLevel(activeLevel);
  };

  const limitedController = useMemo(() => {
    return {
      ...rubikController,
      onMove: (move: RubikMove) => {
        if (!activeLevel || remainingMoves <= 0) return;
        setMoveCount((prev) => prev + 1);
        rubikController.onMove(move);
      },
    };
  }, [activeLevel, remainingMoves, rubikController]);

  const containerStyles: React.CSSProperties = {
    padding: '24px 16px 120px',
    backgroundColor: COLORS.background.abyss,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: DESIGN_CONSTANTS.spacing.lg,
    filter: isGameOver || showPromo ? 'blur(3px)' : 'none',
    transition: 'filter 0.3s ease',
  };

  const playPanelStyles: React.CSSProperties = {
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    backgroundColor: COLORS.background.night,
    boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
    overflow: 'hidden',
    minHeight: '420px',
    pointerEvents: isGameOver || showPromo ? 'none' : 'auto',
  };

  return (
    <div style={containerStyles}>
      <ArcadeMessages successMessage={successMessage} errorMessage={errorMessage} />
      <ArcadeOverlay isVisible={isGameOver || showPromo} />

      {isGameOver && activeLevel && !showPromo && (
        <ArcadeGameOverModal
          levelTitle={activeLevel.title}
          movesUsed={moveCount}
          onBuyMoves={handleBuyMovesFromGameOver}
          onCancel={handleCancelGameOver}
          isLoading={isBuyingMoves}
          tokaCoinsPrice={GAME_OVER_MOVES_PRICE}
        />
      )}

      {showPromo && (
        <ArcadePromoModal
          onBuyPromo={handleBuyPromo}
          onClose={() => setShowPromo(false)}
          isLoading={isBuyingMoves}
          timeLimit={5}
        />
      )}

      {activeLevel ? (
        <>
          <ArcadePlayHeader
            levelTitle={activeLevel.title}
            onExit={handleExitLevel}
            onRestart={handleRestart}
            isExitBlocked={exitBlocked}
          />

          {user && (
            <BalanceHeader
              username={user.username}
              balance={user.tokaCoins}
              level={user.level}
              isLoading={isLoading}
            />
          )}

          <ArcadePlayStats
            movesRemaining={remainingMoves}
            difficulty={activeLevel.difficulty}
            goal={activeLevel.goal}
          />

          <section style={playPanelStyles}>
            <RubikView
              {...limitedController}
              isMoveDisabled={remainingMoves <= 0}
              showUtilityButtons={false}
            />
          </section>

          <ArcadeShopPanel
            items={shopItems}
            onPurchase={handlePurchase}
            isLoading={isLoading}
          />
        </>
      ) : (
        <>
          <ArcadeMapHeader totalStars={totalStars} maxStars={maxStars} />
          <ArcadeMap
            levels={levels}
            onLevelStart={startLevel}
            getDifficultyColor={difficultyColor}
          />
        </>
      )}
    </div>
  );
};
