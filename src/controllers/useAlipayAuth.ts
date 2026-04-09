/**
 * HOOK: useAlipayAuth
 * Gestiona la autenticación con Alipay y sesión del usuario
 */

import { useState, useEffect, useCallback } from 'react';
import type { AlipaySession } from '@/services/alipayAuth';
import { getSession, performFullAuth, clearSession } from '@/services/alipayAuth';
import type { AlipayAuthType } from '@/services/alipayBridge';

export interface AlipayAuthVM {
  session: AlipaySession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (authType?: AlipayAuthType) => Promise<boolean>;
  logout: () => void;
}

export function useAlipayAuth(): AlipayAuthVM {
  const [session, setSession] = useState<AlipaySession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar sesión al montar el componente
  useEffect(() => {
    const stored = getSession();
    if (stored) {
      setSession(stored);
    }
  }, []);

  // Login: obtener auth code e iniciar sesión
  const login = useCallback(async (authType: AlipayAuthType = 'User_Digital_Identity_Information') => {
    setIsLoading(true);
    try {
      const newSession = await performFullAuth(authType);
      if (newSession) {
        setSession(newSession);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout: limpiar sesión
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    login,
    logout,
  };
}
