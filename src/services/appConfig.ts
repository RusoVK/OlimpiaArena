export const APP_CONFIG = {
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
  defaultUserId: import.meta.env.VITE_DEFAULT_USER_ID || 'user_001',
  tokaBaseUrl: import.meta.env.VITE_TOKA_BASE_URL || '',
  tokaAppId: import.meta.env.VITE_TOKA_APP_ID || '',
  tokaMerchantCode: import.meta.env.VITE_TOKA_MERCHANT_CODE || '',
  alipayBridgeUrl:
    import.meta.env.VITE_ALIPAY_BRIDGE_URL ||
    'https://cdn.marmot-cloud.com/npm/hylid-bridge/2.10.0/index.js',
};
