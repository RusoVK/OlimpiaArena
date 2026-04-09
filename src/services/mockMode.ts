import { APP_CONFIG } from './appConfig';
import { isFirebaseConfigured } from './firebaseClient';

export const shouldUseMocks = (): boolean => {
  return APP_CONFIG.useMocks || !isFirebaseConfigured();
};
