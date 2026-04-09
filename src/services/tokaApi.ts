import { APP_CONFIG } from './appConfig';

export type TokaEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type TokaAuthData = {
  userId: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
};

export type TokaUserInfo = {
  nickName?: string;
  fullName?: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  avatar?: string;
  gender?: string;
  birthday?: number;
  nationality?: string;
  email?: string;
  mobilePhone?: string;
  birthState?: string;
  kycState?: string;
};

export type TokaPaymentRequest = {
  userId: string;
  orderTitle: string;
  orderAmount: {
    value: string;
    currency: string;
  };
};

export type TokaPaymentResponse = {
  paymentId: string;
  paymentUrl: string;
};

const isTokaConfigured = (): boolean => {
  return APP_CONFIG.tokaBaseUrl.length > 0 && APP_CONFIG.tokaAppId.length === 16;
};

const request = async <T>(
  path: string,
  options: RequestInit
): Promise<TokaEnvelope<T>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock response',
      data: {} as T,
    };
  }

  const response = await fetch(`${APP_CONFIG.tokaBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Id': APP_CONFIG.tokaAppId,
      ...(options.headers || {}),
    },
  });

  return (await response.json()) as TokaEnvelope<T>;
};

export const authenticateUser = async (authCode: string): Promise<TokaEnvelope<TokaAuthData>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock auth',
      data: {
        userId: 'user_001',
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiresIn: 1800,
      },
    };
  }

  return request<TokaAuthData>('/v1/user/authenticate', {
    method: 'POST',
    body: JSON.stringify({ authcode: authCode }),
  });
};

export const getUserInfo = async (
  authCodes: string[],
  accessToken: string
): Promise<TokaEnvelope<TokaUserInfo>> => {
  return request<TokaUserInfo>('/v1/user/info', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ authCodes }),
  });
};

export const createPayment = async (
  payload: TokaPaymentRequest,
  accessToken: string
): Promise<TokaEnvelope<TokaPaymentResponse>> => {
  return request<TokaPaymentResponse>('/v1/payment/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Alipay-MerchantCode': APP_CONFIG.tokaMerchantCode,
    },
    body: JSON.stringify(payload),
  });
};
