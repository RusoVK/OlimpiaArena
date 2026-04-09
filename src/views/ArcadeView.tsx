/**
 * OLIMPIA ARENA - Pantalla Arcade
 * Mapa de niveles con progresion tipo Duolingo
 * Con sistema de Game Over, Promo y Compra de movimientos
 */

import React, { useEffect, useMemo, useState } from 'react';
import { COLORS, DESIGN_CONSTANTS } from '@/theme';
import { chanjeItem, getMarketItems, getUser } from '@/services/marketAPI';
import type { MarketItem, MarketUser } from '@/models/market/types';
import { useRubikController } from '@/controllers/useRubikController';
import { useAlipayAuth } from '@/controllers/useAlipayAuth';
import type { RubikMove } from '@/models/rubikModel';
import type { TokaPackage } from '@/models/market/tokaPay-types';
import RubikView from './RubikView';
import {
  ArcadePlayTopBar,
  ArcadeMapHeader,
  ArcadeShopPanel,
  ArcadeMap,
  ArcadeMessages,
  ArcadeGameOverModal,
  ArcadePromoModal,
  ArcadeShopAlertButton,
  ArcadeSpinWheel,
  ArcadeTimedSpinOffer,
  ArcadeWinCongrats,
  ArcadeLevelWon,
} from '@/components/arcade';
import { ArcadeTokaShop } from '@/components/arcade/ArcadeTokaShop';
import { TokaPaymentModal } from '@/components/market/TokaPaymentModal';
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
  const [showShopPanel, setShowShopPanel] = useState(false);

  // Estados para la ruleta
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [hasSpunOnce, setHasSpunOnce] = useState(false);
  const [showPaidOffer, setShowPaidOffer] = useState(false);
  const [showWinCongrats, setShowWinCongrats] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<{
    id: string;
    label: string;
    emoji: string;
    isSpinAgain: boolean;
  } | null>(null);

  // Estados para ganar nivel
  const [showLevelWon, setShowLevelWon] = useState(false);
  const TOKA_COINS_REWARD = 10;

  // Estados para TokaCoins
  const [showTokaShop, setShowTokaShop] = useState(false);
  const [selectedTokaPackage, setSelectedTokaPackage] = useState<TokaPackage | null>(null);
  const alipayAuth = useAlipayAuth();

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
        const filteredItems = marketItems.filter((item) => arcadeItemIds.has(item.id));
        // Si no hay items de arcade, usar items por defecto
        if (filteredItems.length === 0) {
          setShopItems([
            {
              id: 'arcade_hint_basic',
              name: 'Pista Básica',
              description: 'Siguiente movimiento',
              price: 150,
              icon: '💡',
              category: 'power-up',
              rarity: 'common',
              createdAt: new Date(),
              active: true,
            },
            {
              id: 'arcade_hint_plus',
              name: 'Pista Plus',
              description: 'Siguientes 3 movimientos',
              price: 350,
              icon: '⚡',
              category: 'power-up',
              rarity: 'rare',
              createdAt: new Date(),
              active: true,
            },
            {
              id: 'arcade_coach_flash',
              name: 'Coach Flash',
              description: 'Solución completa en 5 seg',
              price: 700,
              icon: '🔥',
              category: 'power-up',
              rarity: 'epic',
              createdAt: new Date(),
              active: true,
            },
          ]);
        } else {
          setShopItems(filteredItems);
        }
      } catch (error) {
        console.error('Error cargando arcade:', error);
        setErrorMessage('No se pudo cargar el Arcade');
        // Items por defecto en caso de error
        setShopItems([
          {
            id: 'arcade_hint_basic',
            name: 'Pista Básica',
            description: 'Siguiente movimiento',
            price: 150,
            icon: '💡',
            category: 'power-up',
            rarity: 'common',
            createdAt: new Date(),
            active: true,
          },
          {
            id: 'arcade_hint_plus',
            name: 'Pista Plus',
            description: 'Siguientes 3 movimientos',
            price: 350,
            icon: '⚡',
            category: 'power-up',
            rarity: 'rare',
            createdAt: new Date(),
            active: true,
          },
          {
            id: 'arcade_coach_flash',
            name: 'Coach Flash',
            description: 'Solución completa en 5 seg',
            price: 700,
            icon: '🔥',
            category: 'power-up',
            rarity: 'epic',
            createdAt: new Date(),
            active: true,
          },
        ]);
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

  const handleSpinClick = () => {
    setShowShopPanel(false);
    setShowSpinWheel(true);
  };

  const handlePrizeWon = (prize: { id: string; label: string; emoji: string; isSpinAgain: boolean }, isSecondSpin: boolean) => {
    setSelectedPrize(prize);

    if (prize.isSpinAgain && !isSecondSpin) {
      // Primera vuelta y ganó "otra oportunidad" - pasar directamente a segunda vuelta
      setShowSpinWheel(false);
      setHasSpunOnce(true);
      // Mostrar la ruleta de nuevo automáticamente
      setTimeout(() => {
        setShowSpinWheel(true);
      }, 500);
    } else if (isSecondSpin) {
      // Segunda vuelta terminada - mostrar oferta con timer
      setShowSpinWheel(false);
      setShowPaidOffer(true);
    } else {
      // En la primera vuelta ganó algo que no es "otra oportunidad"
      // Mostrar oferta con timer
      setShowSpinWheel(false);
      setShowPaidOffer(true);
    }
  };

  const handlePaidSpinAccept = async () => {
    if (!user) return;

    setIsBuyingMoves(true);
    const response = await chanjeItem(user.id, 'arcade_extra_moves_10');

    if (response.success) {
      setSuccessMessage('¡Compraste 10 movimientos extra!');
      // +10 del movimiento ganado
      setExtraMoves((prev) => prev + 10);
      setShowPaidOffer(false);
      setShowWinCongrats(true);
      refreshUser();
    } else {
      setErrorMessage(response.message || 'No se pudo completar la compra');
      setShowPaidOffer(false);
    }

    setIsBuyingMoves(false);
  };

  const handlePaidSpinReject = () => {
    setShowPaidOffer(false);
    setHasSpunOnce(false);
  };

  const handleWinCongratsClose = () => {
    setShowWinCongrats(false);
    setShowShopPanel(false);
    setHasSpunOnce(false);
  };

  const handleCubeSolved = async () => {
    // El cubo está resuelto
    if (!user) return;
    
    // Dar tokacoins
    setSuccessMessage(`¡+${TOKA_COINS_REWARD} Ⓜ️ ganados!`);
    
    // Mostrar card de nivel completo
    setShowLevelWon(true);
  };

  const handleLevelRetry = () => {
    if (!activeLevel) return;
    setShowLevelWon(false);
    startLevel(activeLevel);
  };

  const handleLevelNext = () => {
    setShowLevelWon(false);
    exitLevel();
  };

  const handleTokaPackageSelect = (pkg: TokaPackage) => {
    setSelectedTokaPackage(pkg);
  };

  const handleTokaPaymentSuccess = (coinsReceived: number) => {
    if (user) {
      setUser({
        ...user,
        tokaCoins: user.tokaCoins + coinsReceived,
      });
      setSuccessMessage(`¡Has recibido ${coinsReceived} 💎!`);
    }
    setSelectedTokaPackage(null);
  };

  const limitedController = useMemo(() => {
    return {
      ...rubikController,
      onMove: (move: RubikMove) => {
        if (!activeLevel || remainingMoves <= 0) return;
        setMoveCount((prev) => prev + 1);
        rubikController.onMove(move);
      },
      onCubeSolved: handleCubeSolved,
    };
  }, [activeLevel, remainingMoves, rubikController]);

  const containerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    backgroundColor: COLORS.background.abyss,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const playPanelStyles: React.CSSProperties = {
    borderRadius: DESIGN_CONSTANTS.borderRadius.lg,
    border: DESIGN_CONSTANTS.neoBorders.cyanThin,
    backgroundColor: COLORS.background.night,
    boxShadow: DESIGN_CONSTANTS.shadows.innerDepth,
    overflow: 'hidden',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '12px 16px 16px',
    pointerEvents: isGameOver ? 'none' : 'auto',
  };

  return (
    <div style={containerStyles}>
      <ArcadeMessages successMessage={successMessage} errorMessage={errorMessage} />

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
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ArcadePlayTopBar
                onExit={handleExitLevel}
                onRestart={handleRestart}
                isExitBlocked={exitBlocked}
                movesRemaining={remainingMoves}
                difficulty={activeLevel.difficulty}
              />
              {/* Botón de TokaCoins */}
              {user && (
                <button
                  onClick={() => {
                    if (!alipayAuth.session) {
                      alipayAuth.login().catch(() => {
                        setErrorMessage('Error iniciando sesión con Alipay');
                      });
                    } else {
                      setShowTokaShop(!showTokaShop);
                    }
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.gamification.alertOrange}, ${COLORS.neon.cyan})`,
                    border: 'none',
                    color: COLORS.background.abyss,
                    padding: '8px 12px',
                    borderRadius: DESIGN_CONSTANTS.borderRadius.md,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: `0 0 12px rgba(255, 0, 255, 0.4)`,
                  }}
                >
                  💎 {user.tokaCoins}
                </button>
              )}
            </div>
          </div>

          <section style={playPanelStyles}>
            <RubikView
              {...limitedController}
              isMoveDisabled={remainingMoves <= 0}
              showUtilityButtons={true}
            />
          </section>

          <ArcadeShopAlertButton
            onClick={() => setShowShopPanel(!showShopPanel)}
            itemsCount={shopItems.length}
          />

          {showShopPanel && (
            <>
              {/* Overlay */}
              <div
                onClick={() => setShowShopPanel(false)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  zIndex: DESIGN_CONSTANTS.zIndex.overlay - 1,
                }}
              />
              {/* Modal */}
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  zIndex: DESIGN_CONSTANTS.zIndex.overlay,
                  maxWidth: '500px',
                  width: '90%',
                }}
              >
                <ArcadeShopPanel
                  items={shopItems}
                  onPurchase={handlePurchase}
                  isLoading={isLoading}
                  onSpinClick={handleSpinClick}
                />
              </div>
            </>
          )}

          {showSpinWheel && (
            <ArcadeSpinWheel
              onPrizeWon={handlePrizeWon}
              isSecondSpin={hasSpunOnce}
              onClose={() => {
                setShowSpinWheel(false);
                setShowShopPanel(false);
              }}
            />
          )}

          {showPaidOffer && (
            <ArcadeTimedSpinOffer
              onAccept={handlePaidSpinAccept}
              onReject={handlePaidSpinReject}
              isLoading={isBuyingMoves}
            />
          )}

          {showWinCongrats && selectedPrize && (
            <ArcadeWinCongrats
              totalMoves={10}
              bonusMoves={10}
              onClose={handleWinCongratsClose}
            />
          )}

          {showLevelWon && activeLevel && (
            <ArcadeLevelWon
              levelTitle={activeLevel.title}
              tokaCoinsEarned={TOKA_COINS_REWARD}
              onRetry={handleLevelRetry}
              onNext={handleLevelNext}
            />
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <ArcadeMapHeader totalStars={totalStars} maxStars={maxStars} />
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            <ArcadeMap
              levels={levels}
              onLevelStart={startLevel}
              getDifficultyColor={difficultyColor}
            />
          </div>
        </div>
      )}

      {/* Shop de TokaCoins */}
      {showTokaShop && user && (
        <ArcadeTokaShop
          session={alipayAuth.session}
          tokaBalance={user.tokaCoins}
          onPurchaseStart={handleTokaPackageSelect}
          onClose={() => setShowTokaShop(false)}
        />
      )}

      {/* Modal de Pago de TokaCoins */}
      {selectedTokaPackage && alipayAuth.session && (
        <TokaPaymentModal
          package={selectedTokaPackage}
          session={alipayAuth.session}
          onSuccess={handleTokaPaymentSuccess}
          onError={setErrorMessage}
          onCancel={() => setSelectedTokaPackage(null)}
        />
      )}
    </div>
  );
};
