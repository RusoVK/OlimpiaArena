import React, { useState, useEffect } from 'react';
import type { LogEntry } from '@/services/loggerService';
import { logger, onLogsChanged } from '@/services/loggerService';

const LogPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(logger.getLogs());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Nos suscribimos a cambios de logs
    const unsubscribe = onLogsChanged((newLogs) => {
      setLogs(newLogs);
    });

    return unsubscribe;
  }, []);

  // Estilos
  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '350px',
    maxHeight: isOpen ? '400px' : '50px',
    backgroundColor: '#0a0e27',
    border: '2px solid #00d4ff',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10000,
    fontFamily: 'monospace',
    fontSize: '11px',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: '#0f1535',
    borderBottom: isOpen ? '1px solid #00d4ff' : 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    color: '#00d4ff',
    fontWeight: 'bold'
  };

  const logsContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
    display: isOpen ? 'block' : 'none'
  };

  const logEntryStyle = (level: string): React.CSSProperties => {
    const colors: Record<string, string> = {
      info: '#00d4ff',
      success: '#00ff41',
      warning: '#ffbf00',
      error: '#ff0055'
    };

    return {
      padding: '4px 0',
      marginBottom: '4px',
      borderLeft: '3px solid ' + colors[level],
      paddingLeft: '6px',
      color: colors[level],
      lineHeight: '1.3'
    };
  };

  const buttonStyle: React.CSSProperties = {
    padding: '4px 8px',
    marginLeft: '4px',
    backgroundColor: '#00d4ff',
    color: '#0a0e27',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold'
  };

  const handleClear = () => {
    logger.clear();
  };

  const handleExport = () => {
    const text = logger.exportAsText();
    // Copiamos al clipboard
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Logs copiados al portapapeles');
    }).catch(() => {
      // Fallback: mostrar en alert
      alert(text);
    });
  };

  return (
    <div style={panelStyle}>
      <div style={headerStyle} onClick={() => setIsOpen(!isOpen)}>
        <span>🔧 LOGS ALIPAY {logs.length > 0 && `(${logs.length})`}</span>
        <div>
          {isOpen && (
            <>
              <button style={buttonStyle} onClick={(e) => { e.stopPropagation(); handleClear(); }}>
                🗑️ CLEAR
              </button>
              <button style={buttonStyle} onClick={(e) => { e.stopPropagation(); handleExport(); }}>
                📋 COPY
              </button>
              <button style={{...buttonStyle, marginLeft: '2px'}} onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      <div style={logsContainerStyle}>
        {logs.length === 0 ? (
          <div style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
            Sin logs aún...
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} style={logEntryStyle(log.level)}>
              <div style={{ marginBottom: '2px' }}>
                <span style={{ opacity: 0.7 }}>[{log.timestamp}]</span> {log.message}
              </div>
              {log.details && (
                <div style={{ opacity: 0.7, fontSize: '10px', marginLeft: '4px' }}>
                  → {log.details}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;
