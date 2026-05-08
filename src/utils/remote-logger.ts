// Remote logging utility for mobile debugging
// This sends logs to a simple endpoint for viewing without console access

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'warn';
  message: string;
  data?: any;
  userAgent: string;
  url: string;
}

class RemoteLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 50;

  log(level: LogEntry['level'], message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Also store in localStorage for persistence
    try {
      localStorage.setItem('auth_logs', JSON.stringify(this.logs));
    } catch (e) {
      // Ignore storage errors
    }

    // Also log to console for desktop
    console.log(`🔐 [REMOTE-LOG] ${level.toUpperCase()}: ${message}`, data || '');
    
    // Force immediate save to prevent loss during redirect
    this.forceSave();
  }

  forceSave() {
    try {
      const logsToSave = JSON.stringify(this.logs);
      localStorage.setItem('auth_logs', logsToSave);
      // Also save to sessionStorage as backup
      sessionStorage.setItem('auth_logs_backup', logsToSave);
    } catch (e) {
      console.error('Failed to save logs:', e);
    }
  }

  getLogs(): LogEntry[] {
    // Try to get from localStorage first, then sessionStorage as backup
    try {
      let stored = localStorage.getItem('auth_logs');
      if (!stored) {
        // Try sessionStorage backup
        stored = sessionStorage.getItem('auth_logs_backup');
      }
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore storage errors
    }
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('auth_logs');
  }

  // Method to display logs in UI for debugging
  getDebugInfo() {
    const logs = this.getLogs();
    return {
      totalLogs: logs.length,
      recentErrors: logs.filter(log => log.level === 'error').slice(0, 5),
      recentInfo: logs.filter(log => log.level === 'info').slice(0, 10),
      deviceInfo: {
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        screen: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href
      }
    };
  }
}

export const remoteLogger = new RemoteLogger();

// Convenience functions
export const logAuthEvent = (message: string, data?: any) => {
  remoteLogger.log('info', message, data);
};

export const logAuthError = (message: string, error?: any) => {
  remoteLogger.log('error', message, error);
};

export const logAuthWarning = (message: string, data?: any) => {
  remoteLogger.log('warn', message, data);
};
