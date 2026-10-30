import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotFound({ onGoHome, reason = 'not_found' }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setReconnected(true);
      setTimeout(() => {
        onGoHome?.();
      }, 1500);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onGoHome]);

  return (
    <div className="not-found-screen-wrapper">
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="col-sm-10 col-sm-offset-1 text-center">
                
                {/* Status Pill Badge */}
                <div style={{ marginBottom: 16 }}>
                  {reconnected ? (
                    <span className="tag ok pulse-badge" style={{ padding: '6px 16px', fontSize: 13, fontWeight: 700 }}>
                      ✓ INTERNET RECONNECTED — RETURNING HOME...
                    </span>
                  ) : isOffline ? (
                    <span className="tag bad pulse-badge" style={{ padding: '6px 16px', fontSize: 13, fontWeight: 700 }}>
                      ⚡ NETWORK DISCONNECTED / OFFLINE DETECTED
                    </span>
                  ) : (
                    <span className="tag cyan pulse-badge" style={{ padding: '6px 16px', fontSize: 13, fontWeight: 700 }}>
                      ERROR 404 · PAGE NOT AVAILABLE
                    </span>
                  )}
                </div>

                {/* Animated 404 Hero Area with Caveman Illustration matching Image 2 & 3 */}
                <div className="four_zero_four_bg">
                  <h1 className="text-center">404</h1>
                  
                  {/* Prehistoric Caveman Vector Animation */}
                  <div className="caveman-scene" aria-hidden="true">
                    {/* Left Stone Monolith */}
                    <div className="monolith left-monolith" />
                    
                    {/* Caveman Character */}
                    <div className="caveman-char">
                      {/* Head and Beard */}
                      <div className="caveman-head">
                        <div className="caveman-hair" />
                        <div className="caveman-face">
                          <div className="caveman-eye left" />
                          <div className="caveman-eye right" />
                          <div className="caveman-nose" />
                        </div>
                        <div className="caveman-beard" />
                      </div>
                      
                      {/* Body & Animal Skin Tunic */}
                      <div className="caveman-body">
                        <div className="caveman-tunic">
                          <span className="tunic-spot s1" />
                          <span className="tunic-spot s2" />
                          <span className="tunic-spot s3" />
                        </div>
                        <div className="caveman-arm left-arm" />
                        <div className="caveman-arm right-arm">
                          {/* Disconnected Cable */}
                          <div className="disconnected-wire">
                            <div className="spark s1" />
                            <div className="spark s2" />
                          </div>
                        </div>
                      </div>

                      {/* Legs */}
                      <div className="caveman-legs">
                        <div className="caveman-leg left" />
                        <div className="caveman-leg right" />
                      </div>
                    </div>

                    {/* Right Stone Monolith */}
                    <div className="monolith right-monolith" />
                    
                    {/* Ground and Bushes */}
                    <div className="ground-line">
                      <span className="bush b1" />
                      <span className="bush b2" />
                      <span className="bush b3" />
                    </div>
                  </div>
                </div>

                {/* Content Box below illustration */}
                <div className="content_box_404">
                  <h3 className="h2">
                    {isOffline ? "Look like you're offline" : "Look like you're lost"}
                  </h3>
                  
                  <p>
                    {isOffline
                      ? 'No internet connection detected. Please check your network cables or Wi-Fi. As soon as connectivity resumes, TrustLoom AI will automatically reopen the home dashboard.'
                      : 'the page you are looking for not available! It may have been moved, deleted, or network routing failed.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 14 }}>
                    <a
                      href="#home"
                      className="link_404"
                      onClick={(e) => {
                        e.preventDefault();
                        onGoHome?.();
                      }}
                    >
                      Go to Home
                    </a>

                    {isOffline && (
                      <button
                        type="button"
                        className="btn ghost lg"
                        style={{ margin: '20px 0', borderRadius: 6 }}
                        onClick={() => {
                          if (navigator.onLine) {
                            setIsOffline(false);
                            onGoHome?.();
                          } else {
                            alert('Still offline. Please check your network connection.');
                          }
                        }}
                      >
                        🔄 Check Connection
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: 24, fontSize: 12, color: 'var(--tx-dim, #94a3b8)' }}>
                    {isOffline ? (
                      <span>Auto-reconnect monitor active · Listening on <code>window.online</code></span>
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
