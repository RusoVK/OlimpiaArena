import { APP_CONFIG } from './appConfig';
import { logger } from './loggerService';

export type AlipayAuthScope =
  | 'USER_ID'
  | 'USER_AVATAR'
  | 'USER_NICKNAME'
  | 'PLAINTEXT_MOBILE_PHONE'
  | 'PLAINTEXT_EMAIL_ADDRESS'
  | 'USER_ADDRESS'
  | 'USER_NAME'
  | 'USER_FIRST_SURNAME'
  | 'USER_SECOND_SURNAME'
  | 'USER_GENDER'
  | 'USER_BIRTHDAY'
  | 'USER_STATE_OF_BIRTH'
  | 'USER_NATIONALITY'
  | 'USER_KYC_STATUS'
  | 'auth_user';

export type AlipayAuthType =
  | 'User_Digital_Identity_Information'
  | 'User_Contact_Information'
  | 'User_Address_Information'
  | 'User_Personal_Information'
  | 'User_KYC_Status';

export type AlipayAuthResult = {
  success: boolean;
  authCode?: string;
  error?: string;
  mock?: boolean;
  raw?: unknown;
};

export type AlipayPayResult = {
  success: boolean;
  error?: string;
  mock?: boolean;
  raw?: unknown;
};

const getBridge = () => {
  return window.AlipayJSBridge || window.my || null;
};

export const isAlipayBridgeAvailable = (): boolean => {
  return !!getBridge();
};

export const loadAlipayBridge = async (): Promise<boolean> => {
  logger.info('🔍 Verificando disponibilidad del bridge Alipay...');
  
  // Primero verificamos si el bridge ya está disponible (inyectado por la super app)
  const bridge = getBridge();
  if (bridge) {
    logger.success('✅ Bridge detectado (inyectado por super app)');
    return true;
  }

  logger.info('Bridge no detectado, intentando esperar a que se inyecte...');
  
  // Esperamos a que el bridge se inyecte (máximo 5 segundos)
  return await new Promise<boolean>((resolve) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos (50 * 100ms)
    
    const checkBridge = () => {
      attempts++;
      const bridge = getBridge();
      
      if (bridge) {
        logger.success('✅ Bridge inyectado correctamente por la super app');
        resolve(true);
        return;
      }
      
      if (attempts >= maxAttempts) {
        logger.warning('⏱️ Timeout esperando bridge. Intentando cargar desde CDN...');
        loadBridgeFromCDN().then(success => {
          resolve(success);
        }).catch(err => {
          logger.error('❌ No se pudo cargar el bridge', String(err));
          resolve(false);
        });
        return;
      }
      
      setTimeout(checkBridge, 100);
    };
    
    checkBridge();
  });
};

const loadBridgeFromCDN = async (): Promise<boolean> => {
  if (!APP_CONFIG.alipayBridgeUrl) {
    logger.error('❌ URL del bridge no configurada');
    return false;
  }

  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector(`script[src="${APP_CONFIG.alipayBridgeUrl}"]`);
    if (existing) {
      logger.info('Script del bridge ya cargado, esperando inicialización...');
      setTimeout(() => {
        resolve(!!getBridge());
      }, 1000);
      return;
    }

    logger.info('📥 Cargando bridge desde CDN...');
    const script = document.createElement('script');
    script.src = APP_CONFIG.alipayBridgeUrl;
    script.async = true;
    script.onload = () => {
      logger.success('✅ Script del bridge cargado');
      setTimeout(() => {
        const found = getBridge();
        if (found) {
          logger.success('✅ Bridge inicializado desde CDN');
        } else {
          logger.warning('⚠️ Bridge cargado pero aún no disponible');
        }
        resolve(!!found);
      }, 500);
    };
    script.onerror = () => {
      logger.error('❌ Error cargando bridge desde CDN');
      resolve(false);
    };
    document.head.appendChild(script);
  });
};

const callBridge = (method: string, params: Record<string, unknown>): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    if (!bridge) {
      reject(new Error('Bridge de Alipay no disponible'));
      return;
    }

    // Timeout de seguridad (30 segundos)
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout esperando respuesta de my.${method}() - 30s sin respuesta`));
    }, 30000);

    try {
      const callParams = {
        ...params,
        success: (res: unknown) => {
          clearTimeout(timeoutId);
          console.log(`[callBridge] SUCCESS de ${method}:`, res);
          resolve(res);
        },
        fail: (err: unknown) => {
          clearTimeout(timeoutId);
          console.error(`[callBridge] FAIL de ${method}:`, err);
          reject(err);
        },
      };

      console.log(`[callBridge] Llamando my.${method}() con params:`, callParams);
      bridge.call(method, callParams);
    } catch (err) {
      clearTimeout(timeoutId);
      reject(err);
    }
  });
};

export const requestAuthCode = async (
  _type: AlipayAuthType,
  _scopes: AlipayAuthScope[],
  _usage?: string
): Promise<AlipayAuthResult> => {
  try {
    const bridge = getBridge();
    
    if (!bridge) {
      const errorMsg = 'Bridge de Alipay no disponible';
      logger.error('❌ Bridge no encontrado', errorMsg);
      return { success: false, error: errorMsg };
    }

    logger.info('🔵 Obteniendo authCode desde bridge.startupParams...');
    
    // Acceso directo a startupParams (propiedad, no función)
    const startupParams = (bridge as any).startupParams;
    
    if (!startupParams) {
      const error = 'startupParams no disponible';
      logger.error('❌', error);
      return { success: false, error };
    }

    logger.info('📊 startupParams:', JSON.stringify(startupParams).substring(0, 300));

    // Buscar authCode en startupParams nivel 1
    const authFields = ['authCode', 'code', 'authorization', 'token', 'accessToken'];
    for (const field of authFields) {
      if ((startupParams as any)[field]) {
        const value = (startupParams as any)[field];
        logger.success(`✅ ${field} obtenido`, String(value).substring(0, 100));
        return { success: true, authCode: String(value), raw: startupParams };
      }
    }

    // Buscar en safePayContext (probablemente ahí está)
    logger.info('🔎 Revisando safePayContext...');
    const safePayContext = (startupParams as any).safePayContext;
    if (safePayContext) {
      logger.info('   📦 safePayContext:', JSON.stringify(safePayContext).substring(0, 200));
      
      // Si es string, parsearlo
      let contextObj = safePayContext;
      if (typeof safePayContext === 'string') {
        try {
          contextObj = JSON.parse(safePayContext);
          logger.info('   ✅ safePayContext parseado');
        } catch (e) {
          logger.warning('   ⚠️ safePayContext no es JSON válido');
        }
      }
      
      // Buscar authCode en safePayContext
      if (typeof contextObj === 'object') {
        for (const field of authFields) {
          if ((contextObj as any)[field]) {
            const value = (contextObj as any)[field];
            logger.success(`✅ ${field} encontrado en safePayContext`, String(value).substring(0, 100));
            return { success: true, authCode: String(value), raw: contextObj };
          }
        }
        
        logger.info('   Claves en safePayContext:', Object.keys(contextObj).join(', '));
      }
    }

    // Si no hay authCode, error
    logger.error('❌ authCode no encontrado en startupParams');
    
    return { 
      success: false, 
      error: 'authCode no disponible en startupParams. No se puede proceder sin autenticación real.'
    };
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error('❌ Exception', errorMsg);
    return { success: false, error: errorMsg };
  }
};

export const payWithAlipay = async (paymentUrl: string): Promise<AlipayPayResult> => {
  try {
    if (!isAlipayBridgeAvailable()) {
      return { success: true, mock: true };
    }

    const result = await callBridge('pay', { paymentUrl });
    return { success: true, raw: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
