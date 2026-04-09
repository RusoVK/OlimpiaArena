import { loadAlipayBridge, requestAuthCode } from './alipayBridge';
import type { AlipayAuthType, AlipayAuthScope } from './alipayBridge';
import { authenticateUser, getUserInfo } from './tokaApi';
import type { TokaUserInfo } from './tokaApi';

export type AlipaySession = {
  userId: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userInfo?: TokaUserInfo;
  timestamp: number;
};

const SESSION_STORAGE_KEY = 'alipay_session';
const SESSION_TTL = 1800000; // 30 minutos en milisegundos

/**
 * Obtiene el auth code de Alipay según el tipo de información requerida
 */
export const getAuthCode = async (
  type: AlipayAuthType = 'User_Digital_Identity_Information'
): Promise<string | null> => {
  try {
    const available = await loadAlipayBridge();
    if (!available) {
      console.warn('Alipay bridge no disponible');
      return null;
    }

    const scopeMap: Record<AlipayAuthType, AlipayAuthScope[]> = {
      'User_Digital_Identity_Information': ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'],
      'User_Contact_Information': ['PLAINTEXT_MOBILE_PHONE', 'PLAINTEXT_EMAIL_ADDRESS'],
      'User_Address_Information': ['USER_ADDRESS'],
      'User_Personal_Information': [
        'USER_NAME',
        'USER_FIRST_SURNAME',
        'USER_SECOND_SURNAME',
        'USER_GENDER',
        'USER_BIRTHDAY',
        'USER_STATE_OF_BIRTH',
        'USER_NATIONALITY',
      ],
      'User_KYC_Status': ['USER_KYC_STATUS'],
    };

    const result = await requestAuthCode(
      type,
      scopeMap[type],
      'Acceso requerido para continuar en OlimpiaArena'
    );

    return result.success ? result.authCode || null : null;
  } catch (error) {
    console.error('Error obteniendo auth code:', error);
    return null;
  }
};

/**
 * Autentica al usuario intercambiando auth code por JWT
 */
export const authenticate = async (authCode: string): Promise<AlipaySession | null> => {
  try {
    const result = await authenticateUser(authCode);

    if (!result.success) {
      console.error('Error en autenticación:', result.message);
      return null;
    }

    const session: AlipaySession = {
      userId: result.data.userId,
      accessToken: result.data.accessToken,
      tokenType: result.data.tokenType,
      expiresIn: result.data.expiresIn,
      timestamp: Date.now(),
    };

    // Guardar sesión
    saveSession(session);

    return session;
  } catch (error) {
    console.error('Error autenticando:', error);
    return null;
  }
};

/**
 * Obtiene la información completa del usuario desde Toka
 */
export const fetchUserInfo = async (session: AlipaySession): Promise<TokaUserInfo | null> => {
  try {
    // Para mock, no hay auth codes disponibles, así que lo pasamos vacío
    const result = await getUserInfo([], session.accessToken);

    if (!result.success) {
      console.error('Error obteniendo info:', result.message);
      return null;
    }

    // Guardar info en sesión
    const updatedSession = { ...session, userInfo: result.data };
    saveSession(updatedSession);

    return result.data;
  } catch (error) {
    console.error('Error fetchando info de usuario:', error);
    return null;
  }
};

/**
 * Guarda la sesión en localStorage
 */
export const saveSession = (session: AlipaySession): void => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error guardando sesión:', error);
  }
};

/**
 * Recupera la sesión de localStorage si es válida
 */
export const getSession = (): AlipaySession | null => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;

    const session: AlipaySession = JSON.parse(stored);
    const age = Date.now() - session.timestamp;

    // Verifica si la sesión sigue siendo válida
    if (age > SESSION_TTL) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error recuperando sesión:', error);
    return null;
  }
};

/**
 * Limpia la sesión actual
 */
export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando sesión:', error);
  }
};

/**
 * Inicia el flujo completo de autenticación
 */
export const performFullAuth = async (
  authType: AlipayAuthType = 'User_Digital_Identity_Information'
): Promise<AlipaySession | null> => {
  try {
    // 1. Obtener auth code de Alipay
    const authCode = await getAuthCode(authType);
    if (!authCode) {
      console.error('No se pudo obtener auth code');
      return null;
    }

    // 2. Autenticarse con Toka
    const session = await authenticate(authCode);
    if (!session) {
      console.error('Error autenticando');
      return null;
    }

    // 3. Obtener info completa del usuario
    const userInfo = await fetchUserInfo(session);
    if (!userInfo) {
      console.warn('No se pudo obtener info del usuario, pero sesión es válida');
    }

    return session;
  } catch (error) {
    console.error('Error en flujo de autenticación completo:', error);
    return null;
  }
};

/**
 * ✅ Auto-autenticación silenciosa al iniciar la app
 * Intenta autenticarse pero no falla si no está disponible
 */
export const performAutoAuth = async (): Promise<AlipaySession | null> => {
  try {
    // Primero verifica si ya hay sesión válida
    const existingSession = getSession();
    if (existingSession) {
      console.log('[performAutoAuth] Sesión válida encontrada');
      return existingSession;
    }

    // Intenta auth automático (silenciosamente) con datos personales
    console.log('[performAutoAuth] Intentando autenticación automática...');
    const session = await performFullAuth('User_Personal_Information');
    
    if (session) {
      console.log('[performAutoAuth] ✓ Autenticación automática exitosa');
      return session;
    }

    console.log('[performAutoAuth] Autenticación automática no disponible (esperando interacción del usuario)');
    return null;
  } catch (error) {
    // No es crítico, simplemente log
    console.warn('[performAutoAuth] Error (no-crítico):', error);
    return null;
  }
};
