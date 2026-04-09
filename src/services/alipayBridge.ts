import { APP_CONFIG } from './appConfig';

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
  | 'USER_KYC_STATUS';

export type AlipayAuthType =
  | 'DigitalIdentity'
  | 'ContactInformation'
  | 'AddressInformation'
  | 'PersonalInformation'
  | 'KYCStatus';

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
  if (getBridge()) {
    return true;
  }

  if (!APP_CONFIG.alipayBridgeUrl) {
    return false;
  }

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${APP_CONFIG.alipayBridgeUrl}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = APP_CONFIG.alipayBridgeUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar el bridge de Alipay'));
    document.head.appendChild(script);
  });

  return !!getBridge();
};

const callBridge = (method: string, params: Record<string, unknown>): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const bridge = getBridge();
    if (!bridge) {
      reject(new Error('Bridge de Alipay no disponible'));
      return;
    }

    bridge.call(method, params, (res: unknown) => {
      resolve(res);
    });
  });
};

export const requestAuthCode = async (
  type: AlipayAuthType,
  scopes: AlipayAuthScope[],
  usage: string
): Promise<AlipayAuthResult> => {
  try {
    if (!isAlipayBridgeAvailable()) {
      return {
        success: true,
        authCode: 'MOCK6A',
        mock: true,
      };
    }

    const method = `getUser${type}AuthCode`;
    const result: any = await callBridge(method, {
      usage,
      scopes,
    });

    if (result?.authCode) {
      return { success: true, authCode: String(result.authCode), raw: result };
    }

    return { success: false, error: 'No se recibio authCode', raw: result };
  } catch (error) {
    return { success: false, error: String(error) };
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
