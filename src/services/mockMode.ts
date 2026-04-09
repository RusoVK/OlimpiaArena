import { APP_CONFIG } from './appConfig';
import { isFirebaseConfigured } from './firebaseClient';

export const shouldUseMocks = (): boolean => {
  // Si Toka API está configurada, prefiere la API real
  const isTokaAvailable = APP_CONFIG.tokaBaseUrl.length > 0;
  
  // Solo usa mocks si explícitamente está configurado Y Toka no está disponible
  if (!isTokaAvailable && APP_CONFIG.useMocks) {
    return true;
  }
  
  // Si Toka está disponible, no usa mocks
  if (isTokaAvailable) {
    return false;
  }
  
  // Si no hay Toka, usa mocks si Firebase tampoco está configurado
  return !isFirebaseConfigured();
};
