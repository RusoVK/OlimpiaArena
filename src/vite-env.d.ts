/// <reference types="vite/client" />

declare global {
  interface Window {
    AlipayJSBridge?: {
      call: (method: string, params: Record<string, unknown>, callback?: (res: unknown) => void) => void;
    };
    my?: {
      call: (method: string, params: Record<string, unknown>, callback?: (res: unknown) => void) => void;
    };
  }

  interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY?: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly VITE_FIREBASE_APP_ID?: string;
    readonly VITE_DEFAULT_USER_ID?: string;
    readonly VITE_USE_MOCKS?: string;
    readonly VITE_TOKA_BASE_URL?: string;
    readonly VITE_TOKA_APP_ID?: string;
    readonly VITE_TOKA_MERCHANT_CODE?: string;
    readonly VITE_ALIPAY_BRIDGE_URL?: string;
  }
}

export {};
