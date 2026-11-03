import React, { useState, useEffect, useCallback } from 'react';

export default function NotFound({ onGoHome, reason = 'not_found' }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine || reason === 'offline');
  const [reconnected, setReconnected] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleOnlineResume = useCallback(() => {
    setIsOffline(false);
    setReconnected(true);
    setTimeout(() => {
      onGoHome?.();
    }, 1200);
  }, [onGoHome]);

  const handleOfflineEvent = useCallback(() => {
    setIsOffline(true);
    setReconnected(false);
  }, []);

  // Real-time network detection & auto-reconnect poller
  useEffect(() => {
    window.addEventListener('online', handleOnlineResume);
    window.addEventListener('offline', handleOfflineEvent);

    let poller = null;
    if (isOffline) {
      poller = setInterval(() => {
        if (navigator.onLine) {
          fetch('/api/health', { cache: 'no-store' })
            .then(res => {
              if (res.ok) handleOnlineResume();
            })
            .catch(() => {
              // still unreachable
            });
        }
      }, 3000);
    }

    return () => {
      window.removeEventListener('online', handleOnlineResume);
      window.removeEventListener('offline', handleOfflineEvent);
      if (poller) clearInterval(poller);
    };
  }, [isOffline, handleOnlineResume, handleOfflineEvent]);

  const handleManualCheck = (e) => {
    if (e) e.preventDefault();
    setChecking(true);
    if (navigator.onLine) {
      fetch('/api/health', { cache: 'no-store' })
        .then(res => {
          setChecking(false);
          if (res.ok) {
            handleOnlineResume();
          } else {
            handleOnlineResume();
          }
        })
        .catch(() => {
          setChecking(false);
          alert('Still no network connection detected. Please check your Wi-Fi, Ethernet, or mobile hotspot.');
        });
    } else {
      setTimeout(() => {
        setChecking(false);
        alert('Network connection is currently offline. Please reconnect your internet.');
      }, 500);
    }
  };

  const handleGoHomeClick = (e) => {
    if (e) e.preventDefault();
    if (isOffline && !navigator.onLine) {
      handleManualCheck(e);
      return;
    }
    setIsOffline(false);
    onGoHome?.();
  };

  return (
    <div className="not-found-screen-wrapper">
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-10 col-sm-offset-1 text-center">
                
                {/* Status Indicator Pill */}
                <div style={{ marginBottom: 18 }}>
                  {reconnected ? (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        background: '#10b981',
                        color: '#ffffff',
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                      }}
                    >
                      ✓ NETWORK RECONNECTED — RESUMING TRUSTLOOM AI...
                    </span>
                  ) : isOffline ? (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        background: '#ef4444',
                        color: '#ffffff',
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      ⚡ NETWORK DISCONNECTED / OFFLINE DETECTED
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        background: '#3b82f6',
                        color: '#ffffff',
                        borderRadius: 9999,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      ERROR 404 · PAGE NOT AVAILABLE
                    </span>
                  )}
                </div>

                {/* Animated 404 Hero Area with 404.gif from 404-Error-Page-main */}
                <div className="four_zero_four_bg">
                  <h1 className="text-center">404</h1>
                </div>

                {/* Content Box matching 404-Error-Page-main specification */}
                <div className="contant_box_404 content_box_404">
                  <h3 className="h2">
                    {isOffline ? "Look like you're offline" : "Look like you're lost"}
                  </h3>

                  <p>
                    {isOffline
                      ? "Network connection lost or unavailable. Checking for connection... As soon as network is connected, TrustLoom AI will automatically resume running."
                      : "the page you are looking for not avaible!"}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                    <a
                      href="/"
                      className="link_404"
                      onClick={handleGoHomeClick}
                    >
                      Go to Home
                    </a>

                    {isOffline && (
                      <button
                        type="button"
                        onClick={handleManualCheck}
                        disabled={checking}
                        style={{
                          color: '#1e293b',
                          background: '#e2e8f0',
                          border: 'none',
                          padding: '12px 24px',
                          margin: '20px 0',
                          display: 'inline-block',
                          textDecoration: 'none',
                          fontWeight: 700,
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        {checking ? 'Checking...' : '🔄 Recheck Connection'}
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: 22, fontSize: 13, color: '#64748b' }}>
                    {isOffline ? (
                      <span>Auto-reconnect monitor active · Project will resume automatically when online</span>
                    ) : (
                      <span>TrustLoom AI v2.8 · Autonomous Account Intelligence &amp; Heuristic Bot Detection</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
