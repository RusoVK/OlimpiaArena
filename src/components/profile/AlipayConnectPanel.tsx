import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, DESIGN_CONSTANTS } from '@/theme';
import { PanelCard } from '@/components/shared';
import { loadAlipayBridge, requestAuthCode } from '@/services/alipayBridge';
import { authenticateUser } from '@/services/tokaApi';
import './AlipayConnectPanel.css';

export const AlipayConnectPanel: React.FC = () => {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleConnect = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await loadAlipayBridge();
      const result = await requestAuthCode(
        'DigitalIdentity',
        ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'],
        'Usaremos esta informacion para tu perfil dentro de Olimpia Arena.'
      );

      if (!result.success || !result.authCode) {
        setAuthError(result.error || 'No se pudo obtener authCode');
        return;
      }

      setAuthCode(result.authCode);
      const tokenResponse = await authenticateUser(result.authCode);
      if (tokenResponse.success) {
        setAuthToken(tokenResponse.data.accessToken);
      } else {
        setAuthError(tokenResponse.message || 'No se pudo autenticar');
      }
    } catch (error) {
      setAuthError(String(error));
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <PanelCard title="Conexión con Alipay">
      <p style={{ ...TYPOGRAPHY.body.sm, color: COLORS.text.secondary }}>
        Obtiene el authCode para autenticación dentro del ecosistema de la super app.
      </p>
      <button
        className="alipay-button"
        onClick={handleConnect}
        disabled={authLoading}
      >
        {authLoading ? 'Conectando...' : 'Conectar Alipay'}
      </button>
      {authCode && (
        <div className="alipay-result">
          <div style={{ color: COLORS.neon.cyan }}>AuthCode: {authCode}</div>
        </div>
      )}
      {authToken && (
        <div className="alipay-result">
          <div style={{ color: COLORS.text.secondary }}>
            Token: {authToken.slice(0, 8)}...
          </div>
        </div>
      )}
      {authError && (
        <div className="alipay-error">{authError}</div>
      )}
    </PanelCard>
  );
};
