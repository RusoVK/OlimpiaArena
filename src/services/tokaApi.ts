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

export type TokaPaymentInquiry = {
  paymentId: string;
  paymentRequestId: string;
  paymentAmount: number;
  paymentTime: string;
  paymentCreateTime: string;
  paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CLOSED';
  paymentResultCode: string;
  paymentResultMessage: string;
  paymentMethod: string;
  cardNumber: string;
};

export type TokaPaymentCloseRequest = {
  paymentId: string;
};

export type TokaPaymentCloseResponse = {
  result: {
    resultCode: string;
    resultMessage: string;
    resultStatus: string;
  };
  paymentId: string;
};

export type TokaRefundRequest = {
  userId: string;
  paymentId: string;
  refundAmount: {
    value: string;
    currency: string;
  };
};

export type TokaRefundResponse = {
  refundId: string;
};

export type TokaRefundInquiry = {
  refundId: string;
  refundTime: string;
  refundStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  refundResultCode: string | null;
  refundResultMessage: string | null;
  refundAmount: {
    value: number;
    currency: string;
  };
};

const isTokaConfigured = (): boolean => {
  return APP_CONFIG.tokaBaseUrl.length > 0;
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
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock payment created',
      data: {
        paymentId: 'mock_202604011001100100011171003629010',
        paymentUrl: 'https://mock-payment.local/pay',
      },
    };
  }

  return request<TokaPaymentResponse>('/v1/payment/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Alipay-MerchantCode': APP_CONFIG.tokaMerchantCode,
    },
    body: JSON.stringify(payload),
  });
};

export const inquirePayment = async (
  paymentId: string,
  accessToken: string
): Promise<TokaEnvelope<TokaPaymentInquiry>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock payment inquiry',
      data: {
        paymentId,
        paymentRequestId: 'mock-request-id',
        paymentAmount: 500,
        paymentTime: new Date().toISOString(),
        paymentCreateTime: new Date().toISOString(),
        paymentStatus: 'SUCCESS',
        paymentResultCode: '20000000',
        paymentResultMessage: 'SUCCESS',
        paymentMethod: 'Electronic Payment Fund Account',
        cardNumber: '',
      },
    };
  }

  return request<TokaPaymentInquiry>('/v1/payment/inquiry', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ paymentId }),
  });
};

export const closePayment = async (
  paymentId: string,
  accessToken: string
): Promise<TokaEnvelope<TokaPaymentCloseResponse>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock payment closed',
      data: {
        result: {
          resultCode: '20000000',
          resultMessage: 'Success',
          resultStatus: 'S',
        },
        paymentId,
      },
    };
  }

  return request<TokaPaymentCloseResponse>('/v1/payment/close', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ paymentId }),
  });
};

export const refundPayment = async (
  payload: TokaRefundRequest,
  accessToken: string
): Promise<TokaEnvelope<TokaRefundResponse>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock refund created',
      data: {
        refundId: 'mock_202604011001130100011171000213601',
      },
    };
  }

  return request<TokaRefundResponse>('/v1/payment/refund', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Alipay-MerchantCode': APP_CONFIG.tokaMerchantCode,
    },
    body: JSON.stringify(payload),
  });
};

export const inquireRefund = async (
  refundId: string,
  accessToken: string
): Promise<TokaEnvelope<TokaRefundInquiry>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock refund inquiry',
      data: {
        refundId,
        refundTime: new Date().toISOString(),
        refundStatus: 'SUCCESS',
        refundResultCode: null,
        refundResultMessage: null,
        refundAmount: {
          value: 500,
          currency: 'MXN',
        },
      },
    };
  }

  return request<TokaRefundInquiry>('/v1/payment/inquiry-refund', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refundId }),
  });
};

/**
 * Ejecuta un pago usando el bridge de Alipay después de crear la orden
 */
export const executePayment = async (paymentUrl: string): Promise<boolean> => {
  const bridge = window.AlipayJSBridge || window.my;
  if (!bridge) {
    console.warn('Alipay bridge no disponible, usando mock');
    return true;
  }

  return new Promise((resolve) => {
    bridge.call(
      'pay',
      { paymentUrl },
      ((res: unknown) => {
        const typedRes = res as { resultCode?: string; code?: string };
        const success = typedRes.resultCode === '9000' || typedRes.code === '9000';
        resolve(success);
      }) as (res: unknown) => void
    );
  });
};

// Obtener perfil de usuario usando el token JWT
export const getUserProfile = async (token: string): Promise<TokaEnvelope<TokaUserInfo>> => {
  if (!isTokaConfigured()) {
    return {
      success: true,
      statusCode: 200,
      message: 'Mock profile',
      data: {
        nickName: 'MockUser',
        fullName: 'Fernando García López',
        firstName: 'Fernando',
        lastName: 'García',
        gender: 'M',
        birthday: 631152000000,
        nationality: 'Mexican',
        email: 'fernando@example.com',
        mobilePhone: '+52 1234567890',
      },
    };
  }

  return request<TokaUserInfo>('/v1/user/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};
