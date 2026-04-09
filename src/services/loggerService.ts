// Sistema de logging en-app para Alipay H5
// Guardamos logs en localStorage y memoria para mostrarlos en la UI

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

const MAX_LOGS = 100;
let logBuffer: LogEntry[] = [];

// Obtenemos logs previos del localStorage
const loadLogsFromStorage = () => {
  try {
    const stored = localStorage.getItem('app_logs');
    if (stored) {
      logBuffer = JSON.parse(stored);
    }
  } catch (e) {
    logBuffer = [];
  }
};

// Guardamos logs en localStorage
const saveLogsToStorage = () => {
  try {
    // Mantenemos solo los últimos MAX_LOGS
    const toStore = logBuffer.slice(-MAX_LOGS);
    localStorage.setItem('app_logs', JSON.stringify(toStore));
  } catch (e) {
    console.error('Error guardando logs', e);
  }
};

// Listeners para cambios en los logs (para actualizar UI en tiempo real)
const listeners: ((logs: LogEntry[]) => void)[] = [];

export const onLogsChanged = (callback: (logs: LogEntry[]) => void) => {
  listeners.push(callback);
  // Retorna función para desuscribirse
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};

const notifyListeners = () => {
  listeners.forEach(listener => listener([...logBuffer]));
};

// Inicializamos al cargar el módulo
loadLogsFromStorage();

// Funciones de logging
const addLog = (level: LogEntry['level'], message: string, details?: string) => {
  const entry: LogEntry = {
    timestamp: new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }),
    level,
    message,
    details
  };

  logBuffer.push(entry);
  
  // Mantenemos límite
  if (logBuffer.length > MAX_LOGS) {
    logBuffer.shift();
  }

  saveLogsToStorage();
  notifyListeners();

  // También mostramos en console para debugging local
  const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
  if (details) {
    console.log(prefix, message, details);
  } else {
    console.log(prefix, message);
  }
};

export const logger = {
  info: (message: string, details?: string) => addLog('info', message, details),
  success: (message: string, details?: string) => addLog('success', message, details),
  error: (message: string, details?: string) => addLog('error', message, details),
  warning: (message: string, details?: string) => addLog('warning', message, details),

  // Obtener todos los logs
  getLogs: () => [...logBuffer],

  // Limpiar logs
  clear: () => {
    logBuffer = [];
    localStorage.removeItem('app_logs');
    notifyListeners();
  },

  // Exportar como texto
  exportAsText: () => {
    return logBuffer
      .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${log.details ? ' - ' + log.details : ''}`)
      .join('\n');
  }
};
