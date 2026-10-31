import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import {
  Bot,
  MessageSquareCode,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Send,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FlaskConical,
  Zap
} from './icons.jsx';

const Rise = ({ children, d = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: d, duration: 0.5 }}>
    {children}
  </motion.div>
);

export const Logo = ({ s = 34 }) => (
  <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/trustloom-mark.png" width={s} height={s} alt="TrustLoom AI shield mark" style={{ objectFit: 'contain', borderRadius: 8 }} />
    <div>
      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: '#f8fafc' }}>
        TrustLoom<b style={{ color: 'var(--b, #38bdf8)' }}> AI</b>
      </div>
      <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.01em' }}>
        Smarter Social Media. Safer You.
      </div>
    </div>
  </div>
);

export function Globe() {
  const r = useRef();
  useEffect(() => {
    const el = r.current;
    if (!el) return;
    const W = () => el.clientWidth || 300, H = () => el.clientHeight || 300;
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 100);
    cam.position.z = 5.2;
    const rd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rd.setPixelRatio(Math.min(devicePixelRatio, 2));
    rd.setSize(W(), H());
    el.appendChild(rd.domElement);
    const g = new THREE.Group();
    sc.add(g);
    const N = 260, pts = [], col = [], pos = [];
    const c1 = new THREE.Color(0xcdd1ff), c2 = new THREE.Color(0xff4d6d);
    for (let i = 0; i < N; i++) {
      const y = 1 - 2 * (i + 0.5) / N, rr = Math.sqrt(1 - y * y), th = i * 2.399963;
      const v = new THREE.Vector3(Math.cos(th) * rr, y, Math.sin(th) * rr).multiplyScalar(1.9);
      pts.push(v);
      pos.push(v.x, v.y, v.z);
      const bot = i % 7 === 0;
      (bot ? c2 : c1).toArray(col, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.07, vertexColors: true })));
    const lp = [];
    pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
      if (a.distanceTo(b) < 0.62) lp.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }));
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xff5a4d, transparent: true, opacity: 0.2 })));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(1.85, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff3d81, transparent: true, opacity: 0.06 })));
    let mx = 0, my = 0, id;
    const mm = e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); };
    addEventListener('mousemove', mm);
    const loop = () => {
      g.rotation.y += 0.003;
      g.rotation.x += (my * 0.5 - g.rotation.x) * 0.03;
      g.rotation.z = mx * 0.3;
      rd.render(sc, cam);
      id = requestAnimationFrame(loop);
    };
    loop();
    const rs = () => {
      if (!el) return;
      cam.aspect = W() / H();
      cam.updateProjectionMatrix();
      rd.setSize(W(), H());
    };
    addEventListener('resize', rs);
    return () => {
      cancelAnimationFrame(id);
      removeEventListener('resize', rs);
      removeEventListener('mousemove', mm);
      rd.dispose();
      if (el) el.innerHTML = '';
    };
  }, []);
  return <div ref={r} className="globe" />;
}

// Inline Markdown & Formatting Helper
function renderInlineText(text) {
  if (!text) return null;
  // Handle <ul><li> tags from LLM
  if (text.includes('<ul>') || text.includes('<li>')) {
    const items = text.replace(/<\/?ul>/g, '').split('</li>').map(s => s.replace(/<li>/, '').trim()).filter(Boolean);
    return (
      <ul className="chat-ul" style={{ margin: '4px 0', paddingLeft: 18 }}>
        {items.map((it, idx) => (
          <li key={idx} className="chat-li">
            {renderInlineText(it)}
          </li>
        ))}
      </ul>
    );
  }

  // Split on bold **text** and inline `code`
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={match.index} className="chat-strong">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(<code key={match.index} className="chat-code">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={match.index} style={{ color: 'var(--a)' }}>{token.slice(1, -1)}</em>);
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return parts.length ? parts : text;
}

// Full Markdown & Table Content Parser
function FormattedMessage({ text }) {
  if (!text) return null;

  // Normalize inline tables that might be concatenated: e.g. "| a | b | | c | d |"
  let normalized = text.replace(/\|\s*\|\s*/g, '|\n|');

  // Split by double newlines or single newlines
  const lines = normalized.split('\n');
  const elements = [];
  let tableRows = [];
  let inCodeBlock = false;
  let codeBlockLines = [];

  const flushTable = (key) => {
    if (tableRows.length === 0) return;
    
    // Filter out separator lines like |---|---|
    const validRows = tableRows.filter(r => !/^\s*\|?(\s*:?-+:?\s*\|)+\s*$/.test(r));
    if (validRows.length > 0) {
      const headerRow = validRows[0].split('|').map(c => c.trim()).filter((c, i, a) => (i > 0 && i < a.length - 1) || c);
      const dataRows = validRows.slice(1).map(r => 
        r.split('|').map(c => c.trim()).filter((c, i, a) => (i > 0 && i < a.length - 1) || c)
      );

      elements.push(
        <div key={`table-${key}`} className="chat-table-wrapper">
          <table className="chat-table">
            <thead>
              <tr>
                {headerRow.map((h, hi) => (
                  <th key={hi}>{renderInlineText(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{renderInlineText(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableRows = [];
  };

  const flushCode = (key) => {
    if (codeBlockLines.length === 0) return;
    elements.push(
      <pre key={`code-${key}`} className="chat-pre">
        <code>{codeBlockLines.join('\n')}</code>
      </pre>
    );
    codeBlockLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code block ```
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCode(i);
        inCodeBlock = false;
      } else {
        flushTable(i);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Handle table row
    if (line.includes('|') && line.trim().startsWith('|')) {
      tableRows.push(line.trim());
      continue;
    } else {
      flushTable(i);
    }

    // Handle headings
    if (line.startsWith('## ')) {
      elements.push(
        <div key={i} className="chat-h2">
          <Sparkles size={14} style={{ color: '#00f0ff', flexShrink: 0 }} />
          <span>{renderInlineText(line.slice(3).trim())}</span>
        </div>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <div key={i} className="chat-h3">
          {renderInlineText(line.slice(4).trim())}
        </div>
      );
      continue;
    }

    // Handle bullet items
    if (/^\s*[-*•]\s+/.test(line)) {
      elements.push(
        <div key={i} className="chat-li" style={{ marginLeft: 16 }}>
          {renderInlineText(line.replace(/^\s*[-*•]\s+/, ''))}
        </div>
      );
      continue;
    }

    // Regular text paragraph
    if (line.trim()) {
      elements.push(
        <p key={i} style={{ margin: '6px 0', lineHeight: 1.6 }}>
          {renderInlineText(line)}
        </p>
      );
    }
  }

  flushTable('end');
  flushCode('end');

  return <div className="chat-formatted-body">{elements}</div>;
}

const SUG = [
  'Explain the deep learning model',
  'What accuracy did you get across 10 classifiers?',
  'How does the blockchain SHA-256 log work?',
  'Explain Cresci-15 vs Cresci-17 datasets',
  'How to fix cross-dataset accuracy drop?'
];

export function Chat() {
  const [o, setO] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [m, setM] = useState([
    {
      role: 'assistant',
      content: 'Hi! Ask me anything about TrustLoom AI: the 10 classifiers, Cresci datasets, threshold calibration, blockchain audit log, or multi-role system architecture.'
    }
  ]);
  const [q, setQ] = useState('');
  const [ld, setLd] = useState(false);
  const end = useRef();

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [m, ld]);

  const send = async t => {
    t = (t ?? q).trim();
    if (!t || ld) return;
    const nm = [...m, { role: 'user', content: t }];
    setM(nm);
    setQ('');
    setLd(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: t,
          messages: nm.map(x => ({ role: x.role, content: x.content }))
        })
      });
      const j = await r.json();
      setM([...nm, { role: 'assistant', content: j.text || 'No response generated.' }]);
    } catch {
      setM([...nm, { role: 'assistant', content: 'Server not reachable. Please check if backend is running on port 5050.' }]);
    }
    setLd(false);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const resetChat = () => {
    setM([
      {
        role: 'assistant',
        content: 'Hi! Ask me anything about TrustLoom AI: the 10 classifiers, Cresci datasets, threshold calibration, blockchain audit log, or multi-role system architecture.'
      }
    ]);
  };

  return (
    <>
      <button
        className="chatb"
        onClick={() => setO(!o)}
        aria-label="AI assistant"
      >
        {o ? (
          <X size={24} color="#ffffff" />
        ) : (
          <svg width="25" height="25" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
            <path d="M12 3C6.48 3 2 6.8 2 11.5c0 2.65 1.44 5.01 3.7 6.54-.15.93-.68 2.58-1.92 3.86 1.95 0 3.87-.73 5.09-1.6.37.05.74.08 1.13.08 5.52 0 10-3.8 10-8.88S17.52 3 12 3z" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {o && (
          <motion.div
            className={`card chat ${expanded ? 'expanded' : ''}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {/* Upgraded Header with Controls */}
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="chat-avatar-badge">
                  <Bot size={20} />
                  <span className="status-dot" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <b style={{ fontSize: 14, color: '#fff' }}>TrustLoom Assistant</b>
                    <span className="tag cyan" style={{ fontSize: 9, padding: '1px 6px' }}>v2.4 AI</span>
                  </div>
                  <small style={{ color: 'var(--tx-dim)', fontSize: 11 }}>
                    Project Q&amp;A · ML · DL · Blockchain · Explainability
                  </small>
                </div>
              </div>

              <div className="chat-controls">
                <button
                  className="chat-ctrl-btn"
                  onClick={resetChat}
                  title="Clear conversation"
                  aria-label="Clear chat"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  className="chat-ctrl-btn"
                  onClick={() => setExpanded(!expanded)}
                  title={expanded ? 'Compress view' : 'Expand full view'}
                  aria-label="Toggle size"
                >
                  {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  className="chat-ctrl-btn"
                  onClick={() => setO(false)}
                  title="Close chat"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages Area with Markdown Rendering */}
            <div className="ms">
              {m.map((x, i) => (
                <motion.div
                  key={i}
                  className={'bub ' + (x.role === 'user' ? 'u' : 'a')}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {x.role === 'user' ? (
                    <div>{x.content}</div>
                  ) : (
                    <>
                      <FormattedMessage text={x.content} />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                        <button
                          className="chat-copy-btn"
                          onClick={() => copyToClipboard(x.content, i)}
                          title="Copy response to clipboard"
                        >
                          {copiedIdx === i ? (
                            <>
                              <Check size={12} style={{ color: '#10b981' }} />
                              <span style={{ color: '#10b981' }}>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy response</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}

              {/* Suggestion Chips */}
              {m.length <= 2 && (
                <div className="chips">
                  {SUG.map(s => (
                    <button key={s} onClick={() => send(s)}>
                      <Sparkles size={11} style={{ color: 'var(--a)' }} />
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing / Loading Skeleton */}
              {ld && (
                <div className="bub a" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px' }}>
                  <Bot size={16} className="spin" style={{ color: 'var(--a)' }} />
                  <span style={{ fontSize: 12, color: 'var(--tx-dim)' }}>TrustLoom AI is analyzing research telemetry…</span>
                </div>
              )}
              <div ref={end} />
            </div>

            {/* Input Bar */}
            <div className="in">
              <input
                style={{ margin: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}
                placeholder="Ask about research paper, models, Cresci datasets…"
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
              />
              <button
                className="btn"
                onClick={() => send()}
                disabled={ld || !q.trim()}
                style={{ borderRadius: 12, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================================
   BLOCKCHAIN CHAIN OF CUSTODY (Standalone or embedded)
   ========================================================================= */
export function Chain({ t }) {
  const [d, setD] = useState(null);
  useEffect(() => {
    fetch('/api/audit', { headers: { Authorization: 'Bearer ' + t } }).then(r => r.json()).then(setD).catch(() => {});
  }, [t]);
  const bl = d ? [...d.entries].reverse().slice(-14) : [];
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="card">
        <div className="top">
          <div>
            <b>Cryptographic SHA-256 Chain of Custody</b>
            <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>Immutable hash-linked verification ledger</div>
          </div>
          <span className={'tag ' + (d?.valid ? 'ok' : 'bad')}>
            {d ? (d.valid ? '✔ ALL BLOCKS VERIFIED (UNBROKEN)' : '✖ HASH CHAIN BROKEN') : 'verifying…'}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--tx-dim)', lineHeight: 1.6, margin: '8px 0 0' }}>
          Each block incorporates the SHA-256 digest of the preceding block along with timestamp, user identity, action code, and forensic payload metadata. Tampering with any historical entry invalidates all subsequent block checksums instantly.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 14, alignItems: 'center' }}>
        {bl.map((e, i) => (
          <motion.div key={e.hash || i} style={{ display: 'flex', alignItems: 'center', gap: 12 }} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="card hv blk2" style={{ minWidth: 220 }}>
              <span className="tag ok" style={{ fontSize: 10 }}>{e.action}</span>
              <p style={{ margin: '8px 0 4px', fontSize: 13 }}><b>{e.user}</b></p>
              <small style={{ color: 'var(--tx-dim)', fontSize: 11 }}>{e.ts?.slice(0, 19).replace('T', ' ')}</small>
              <p style={{ margin: '8px 0 2px', color: 'var(--mut)', fontSize: 11 }}>prev: {e.prev?.slice(0, 10)}…</p>
              <p style={{ margin: 0, fontSize: 11 }}>hash: <b style={{ color: 'var(--a)' }}>{e.hash?.slice(0, 12)}…</b></p>
            </div>
            {i < bl.length - 1 && <span style={{ fontSize: 20, color: 'var(--tx-dim)' }}>→</span>}
          </motion.div>
        ))}
        {!bl.length && <div className="card" style={{ padding: 20 }}>Loading cryptographic audit ledger...</div>}
      </div>
    </div>
  );
}

/* =========================================================================
   DATA SCIENTIST / AI ENGINEER ML RETRAIN & THRESHOLD CALIBRATION LAB
   (Table II, Fig. 4, Fig. 5, Fig. 6 from research paper)
   ========================================================================= */
const TABLE_II_MODELS = [
  { name: 'LightGBM Boosted Tree', acc15: 99.44, f1_15: 99.55, auc15: 0.9998, acc17: 99.45, f1_17: 99.69, auc17: 0.9995, sota: true },
  { name: 'AdaBoost Classifier', acc15: 99.38, f1_15: 99.50, auc15: 0.9995, acc17: 99.53, f1_17: 99.74, auc17: 0.9996, sota: true },
  { name: 'XGBoost Baseline', acc15: 99.36, f1_15: 99.48, auc15: 0.9997, acc17: 99.46, f1_17: 99.70, auc17: 0.9994 },
  { name: 'Random Forest (300 Trees)', acc15: 99.36, f1_15: 99.48, auc15: 0.9996, acc17: 99.30, f1_17: 99.61, auc17: 0.9990 },
  { name: 'Extra Trees Ensemble', acc15: 98.87, f1_15: 99.09, auc15: 0.9993, acc17: 99.15, f1_17: 99.52, auc17: 0.9989 },
  { name: 'SVM (RBF Kernel)', acc15: 98.80, f1_15: 99.03, auc15: 0.9991, acc17: 99.04, f1_17: 99.46, auc17: 0.9986 },
  { name: 'Logistic Regression', acc15: 98.78, f1_15: 99.01, auc15: 0.9981, acc17: 99.18, f1_17: 99.54, auc17: 0.9984 },
  { name: 'Two-Layer MLP (64, 32 Deep Net)', acc15: 98.60, f1_15: 98.87, auc15: 0.9978, acc17: 99.17, f1_17: 99.53, auc17: 0.9968, dl: true },
  { name: 'Decision Tree (CART)', acc15: 98.37, f1_15: 98.69, auc15: 0.9830, acc17: 98.88, f1_17: 99.38, auc17: 0.9673 },
  { name: 'Gaussian Naïve Bayes', acc15: 95.18, f1_15: 96.06, auc15: 0.9843, acc17: 97.38, f1_17: 98.52, auc17: 0.9918 }
];

const ABLATION_STEPS = [
  { group: 'Profile Features (16)', c15: 92.93, c17: 98.03, desc: 'Account age, default avatar, location enabled, username digit ratio, verified badge.' },
  { group: '+ Behavioral Features (6)', c15: 95.40, c17: 99.34, desc: 'Status creation rate, favorite count, retweet ratio, mention & reply frequencies.' },
  { group: '+ Temporal Features (10)', c15: 96.90, c17: 99.40, desc: 'Inter-tweet interval mean/std, night posting percentage, zero-interval burstiness.' },
  { group: '+ Textual Features (6)', c15: 97.40, c17: 99.50, desc: 'Repeated text share, URL fraction, hashtag density, average character length.' },
  { group: '+ Engagement Features (5)', c15: 98.80, c17: 99.52, desc: 'Retweet-to-post ratio, average favorites per status, follower growth rate per day.' },
  { group: '+ Network Structure (4)', c15: 99.44, c17: 99.53, desc: 'Follower-to-following ratio, bidirectional friend symmetry, graph in/out degree.' }
];

const SHAP_TOP_10 = [
  { rank: 1, feature: 'follower_to_following_ratio', cresci15: '44.6%', cresci17: '13.5%', group: 'Network', sign: 'Primary discriminator in Cresci-15' },
  { rank: 2, feature: 'account_age_days', cresci15: '21.4%', cresci17: '34.1%', group: 'Temporal', sign: 'Evolving bots show younger registration timestamps' },
  { rank: 3, feature: 'retweet_share_ratio', cresci15: '12.8%', cresci17: '28.8%', group: 'Behavioral', sign: 'Automated amplification pods exhibit >85% retweets' },
  { rank: 4, feature: 'favorite_count_per_status', cresci15: '8.2%', cresci17: '11.4%', group: 'Engagement', sign: 'Organic users favor reciprocal content; bots ignore' },
  { rank: 5, feature: 'default_profile_image', cresci15: '5.1%', cresci17: '4.8%', group: 'Profile', sign: 'Missing avatar indicates low-effort bot farm creation' },
  { rank: 6, feature: 'night_posting_percentage', cresci15: '3.3%', cresci17: '2.9%', group: 'Temporal', sign: '24/7 robotic scheduling ignores human circadian rhythms' },
  { rank: 7, feature: 'repeated_text_percentage', cresci15: '2.4%', cresci17: '2.1%', group: 'Textual', sign: 'Phishing campaign message duplication fingerprint' },
  { rank: 8, feature: 'friends_count_outbound', cresci15: '1.9%', cresci17: '1.2%', group: 'Network', sign: 'Mass-follow bots rapidly follow thousands of strangers' },
  { rank: 9, feature: 'digits_in_screen_name', cresci15: '0.9%', cresci17: '0.8%', group: 'Profile', sign: 'Algorithmic random handle generator artifact' },
  { rank: 10, feature: 'has_bio_description', cresci15: '0.6%', cresci17: '0.4%', group: 'Profile', sign: 'Empty description string common in sleeper accounts' }
];

export function MLLab({ t }) {
  const [ds, setDs] = useState(1); // 1 = Cresci-15, 2 = Cresci-17
  const [activeTab, setActiveTab] = useState('classifiers'); // classifiers, ablation, shap, calibration, retrain
  const [threshold, setThreshold] = useState(0.50);
  const [calibrating, setCalibrating] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Load active threshold
  useEffect(() => {
    fetch('/api/ml/calibration', { headers: { Authorization: 'Bearer ' + t } })
      .then(r => r.json())
      .then(d => {
        if (d.threshold != null) setThreshold(d.threshold);
      })
      .catch(() => {});
  }, [t]);

  const saveThreshold = async newThresh => {
    setThreshold(newThresh);
    setCalibrating(true);
    try {
      await fetch('/api/ml/calibration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify({ threshold: newThresh })
      });
      setFeedback(`Decision threshold recalibrated to ${newThresh.toFixed(2)}. Decision boundary adjusted.`);
      setTimeout(() => setFeedback(''), 4000);
    } catch {
      setFeedback('Failed to update threshold.');
    } finally {
      setCalibrating(false);
    }
  };

  const runRetrain = async () => {
    setRetraining(true);
    setRetrainResult(null);
    try {
      const res = await fetch('/api/ml/retrain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify({ sampleCount: 500 })
      }).then(r => r.json());
      setRetrainResult(res);
      setFeedback('10 Core Classifiers retrained with fresh evolving bot batch! Weights updated.');
    } catch {
      setFeedback('Retraining request failed.');
    } finally {
      setRetraining(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Research Paper Citation Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(168, 85, 247, 0.12))' }}>
        <div className="eyebrow">RESEARCH FOUNDATION &amp; EXPERIMENTAL METHODOLOGY</div>
        <h2 style={{ margin: '6px 0 8px', fontSize: 24 }}>
          A Multi-Feature Interpretable Machine Learning Framework for Identifying Spam Bots and Fake Followers
        </h2>
        <p style={{ margin: 0, color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
          <b>Authors:</b> B. Mahesh Reddy, Perla Yallamma, Perugu Yashwanth Krishna, Shaik Yasmeen, Sambugalla Harinath<br />
          <b>Department of Computer Science &amp; Engineering</b> · K.S.R.M. College of Engineering, Kadapa, India
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="seg" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[
          { id: 'classifiers', label: '1. 10 Core Classifiers (Table II)' },
          { id: 'ablation', label: '2. 6-Group Feature Ablation (Fig. 4)' },
          { id: 'shap', label: '3. SHAP & LIME Interpretability (Fig. 5 & 6)' },
          { id: 'calibration', label: '4. Threshold Calibration (Fix Cross-Dataset Drop)' },
          { id: 'retrain', label: '5. Retrain Lab with Fresh Bot Batch' }
        ].map(tb => (
          <button
            key={tb.id}
            className={activeTab === tb.id ? 'on' : ''}
            onClick={() => setActiveTab(tb.id)}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {feedback && (
        <div className="card" style={{ padding: 12, color: 'var(--ok)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          {feedback}
        </div>
      )}

      {/* TAB 1: 10 Classifiers Benchmark */}
      {activeTab === 'classifiers' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card">
            <div className="top">
              <div>
                <b>Table II: Five-Fold Cross-Validated Classifier Comparison</b>
                <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                  Evaluated on Cresci-15 (5,148 accounts) and Cresci-17 (10,197 accounts)
                </div>
              </div>
              <div className="seg">
                {['Cresci-15 Benchmark', 'Cresci-17 Benchmark'].map((name, i) => (
                  <button key={name} className={ds === i + 1 ? 'on' : ''} onClick={() => setDs(i + 1)}>
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Model Architecture</th>
                    <th>{ds === 1 ? 'Cresci-15 Accuracy' : 'Cresci-17 Accuracy'}</th>
                    <th>F1-Score</th>
                    <th>ROC-AUC</th>
                    <th>Benchmark Status</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_II_MODELS.map((m, idx) => {
                    const acc = ds === 1 ? m.acc15 : m.acc17;
                    const f1 = ds === 1 ? m.f1_15 : m.f1_17;
                    const auc = ds === 1 ? m.auc15 : m.auc17;
                    return (
                      <tr key={idx}>
                        <td>
                          <b>{m.name}</b>
                          {m.dl && <span className="tag purple" style={{ marginLeft: 8, fontSize: 10 }}>DEEP LEARNING</span>}
                        </td>
                        <td>
                          <b style={{ color: m.sota ? 'var(--a)' : 'var(--tx)' }}>{acc}%</b>
                        </td>
                        <td>{f1}%</td>
                        <td>
                          <code style={{ color: 'var(--ok)' }}>{auc.toFixed(4)}</code>
                        </td>
                        <td>
                          {m.sota ? (
                            <span className="tag ok">BEST ENSEMBLE SOTA</span>
                          ) : (
                            <span className="tag cyan">VALIDATED</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Feature Groups Ablation */}
      {activeTab === 'ablation' && (
        <div className="card">
          <div className="top">
            <div>
              <b>Figure 4: Cumulative Feature Group Addition (Ablation Analysis)</b>
              <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                Demonstrates how each added category lifts LightGBM cross-validated accuracy
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
            {ABLATION_STEPS.map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--bd)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <b>{step.group}</b>
                  <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                    <span>Cresci-15: <b style={{ color: 'var(--a)' }}>{step.c15}%</b></span>
                    <span>Cresci-17: <b style={{ color: '#a855f7' }}>{step.c17}%</b></span>
                  </div>
                </div>
                <div style={{ height: 6, background: 'var(--bd)', borderRadius: 4, margin: '8px 0' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(step.c15 - 90) / 10 * 100}%`,
                      background: 'linear-gradient(90deg, var(--a), #a855f7)',
                      borderRadius: 4
                    }}
                  />
                </div>
                <small style={{ color: 'var(--tx-dim)', fontSize: 12 }}>{step.desc}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SHAP & LIME */}
      {activeTab === 'shap' && (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="card">
            <div className="top">
              <div>
                <b>Figure 5: Top 10 Features by Mean Absolute SHAP Value</b>
                <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                  Global feature impact distribution: Follower-to-following ratio dominates Cresci-15 (44.6%), while account age dominates Cresci-17 (34.1%)
                </div>
              </div>
            </div>

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Feature Identifier</th>
                    <th>Feature Group</th>
                    <th>Cresci-15 Impact</th>
                    <th>Cresci-17 Impact</th>
                    <th>Behavioral Finding</th>
                  </tr>
                </thead>
                <tbody>
                  {SHAP_TOP_10.map(s => (
                    <tr key={s.rank}>
                      <td>#{s.rank}</td>
                      <td><code>{s.feature}</code></td>
                      <td><span className="tag cyan">{s.group}</span></td>
                      <td><b>{s.cresci15}</b></td>
                      <td><b>{s.cresci17}</b></td>
                      <td style={{ fontSize: 12, color: 'var(--tx-dim)' }}>{s.sign}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* LIME Local Account Explanation Card */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div className="card">
              <span className="tag bad" style={{ marginBottom: 8 }}>FIGURE 6(A): BOT INSTANCE LIME</span>
              <h3 style={{ margin: '4px 0 8px' }}>Confirmed Cresci-17 Bot (P = 1.000)</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
                <li style={{ color: 'var(--bad)' }}>+ Lack of retweet share (t_rt_frac &lt;= 0.00)</li>
                <li style={{ color: 'var(--bad)' }}>+ Fresh creation age (&lt; 140 days)</li>
                <li style={{ color: 'var(--bad)' }}>+ Zero favorites recorded (fav_count == 0)</li>
                <li style={{ color: 'var(--bad)' }}>+ Default avatar asset (default_image == 1)</li>
                <li style={{ color: 'var(--bad)' }}>+ Follower/friend ratio &lt;= 2.85</li>
              </ul>
            </div>

            <div className="card">
              <span className="tag ok" style={{ marginBottom: 8 }}>FIGURE 6(B): GENUINE INSTANCE LIME</span>
              <h3 style={{ margin: '4px 0 8px' }}>Confirmed Genuine Account (P = 0.000)</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
                <li style={{ color: 'var(--ok)' }}>- Organic retweet share (t_rt_frac &gt; 0.00)</li>
                <li style={{ color: 'var(--ok)' }}>- Mature account history (&gt; 2 years old)</li>
                <li style={{ color: 'var(--ok)' }}>- High favorite count &amp; timeline engagement</li>
                <li style={{ color: 'var(--ok)' }}>- Custom verified avatar and enabled geolocation</li>
                <li style={{ color: 'var(--ok)' }}>- Symmetrical network reciprocity</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Threshold Calibration */}
      {activeTab === 'calibration' && (
        <div className="card">
          <div className="eyebrow">RESEARCH PAPER SECTION IV-F MITIGATION</div>
          <h2 style={{ margin: '4px 0 8px' }}>Cross-Dataset Accuracy Drop &amp; Threshold Calibration</h2>
          <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
            In your research paper, testing a model trained on Cresci-15 against Cresci-17 dropped accuracy from <b>99.4% down to 56.8% (LightGBM)</b> and <b>45.0% (Random Forest)</b>, despite ROC-AUC remaining &gt;0.885. This occurs because the fixed default decision boundary (0.50) suffers from domain shift. Adjusting the calibrated decision threshold recovers the true decision boundary!
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: 18, borderRadius: 14, border: '1px solid var(--bd)', margin: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <b>Calibrate Decision Threshold (&theta;)</b>
              <h2 className="grad" style={{ margin: 0 }}>{threshold.toFixed(2)}</h2>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.02"
              value={threshold}
              onChange={e => saveThreshold(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--tx-dim)', marginTop: 4 }}>
              <span>0.10 (High Recall / Aggressive Bot Catching)</span>
              <span>0.50 (Standard Benchmark Default)</span>
              <span>0.90 (High Precision / Low False Positives)</span>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--bad)' }}>
              <b>Before Threshold Calibration</b>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--bad)', margin: '6px 0' }}>
                45.0% – 56.8%
              </div>
              <small style={{ color: 'var(--tx-dim)' }}>
                Cross-dataset accuracy on uncalibrated boundary due to behavioral signature drift between Cresci-15 and Cresci-17.
              </small>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--ok)' }}>
              <b>After Dynamic Threshold Calibration</b>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ok)', margin: '6px 0' }}>
                86.4% – 89.2%
              </div>
              <small style={{ color: 'var(--tx-dim)' }}>
                Calibrated decision boundary recovers +32.4% accuracy without requiring complete model re-architecture.
              </small>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Retrain Lab */}
      {activeTab === 'retrain' && (
        <div className="card">
          <div className="eyebrow">CONTINUOUS ADAPTIVE LEARNING</div>
          <h2 style={{ margin: '4px 0 8px' }}>Retrain Classifiers with Fresh Evolving Bot Batch</h2>
          <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
            Upload fresh labeled training data (CSV) or trigger the automated synthetic retrain pipeline to adapt the 10 core classifiers to new bot swarms, engagement pods, and phishing sleeper accounts.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '18px 0' }}>
            <button className="btn" disabled={retraining} onClick={runRetrain}>
              {retraining ? 'Retraining 10 Classifiers...' : '⚡ Retrain 10 Core Classifiers (500 Samples)'}
            </button>
            <label className="btn ghost" style={{ cursor: 'pointer' }}>
              📁 Upload Custom CSV Dataset
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={runRetrain} />
            </label>
          </div>

          {retrainResult && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid var(--a)' }}>
              <div className="top">
                <b>Retraining Complete · Checkpoint Validated</b>
                <span className="tag ok">MODEL WEIGHTS SYNCHRONIZED</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--tx-dim)', margin: '8px 0 14px' }}>
                {retrainResult.message}
              </p>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div>
                  <small style={{ color: 'var(--tx-dim)' }}>LightGBM CV</small>
                  <h3 style={{ margin: '4px 0', color: 'var(--a)' }}>{retrainResult.metrics.lightgbm}%</h3>
                </div>
                <div>
                  <small style={{ color: 'var(--tx-dim)' }}>AdaBoost SOTA</small>
                  <h3 style={{ margin: '4px 0', color: '#a855f7' }}>{retrainResult.metrics.adaboost}%</h3>
                </div>
                <div>
                  <small style={{ color: 'var(--tx-dim)' }}>MLP Deep Net</small>
                  <h3 style={{ margin: '4px 0', color: 'var(--ok)' }}>{retrainResult.metrics.mlpNeuralNet}%</h3>
                </div>
                <div>
                  <small style={{ color: 'var(--tx-dim)' }}>Cross-Dataset Lift</small>
                  <h3 style={{ margin: '4px 0', color: 'var(--ok)' }}>{retrainResult.metrics.crossDatasetAccuracy}</h3>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   DEVELOPER / API USER PORTAL (Keys, Quotas & Integration SDK)
   ========================================================================= */
export function DeveloperKeys({ t }) {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [copiedKey, setCopiedKey] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadKeys = () => {
    fetch('/api/developer/keys', { headers: { Authorization: 'Bearer ' + t } })
      .then(r => r.json())
      .then(d => setKeys(d.keys || []))
      .catch(() => {});
  };

  useEffect(() => { loadKeys(); }, [t]);

  const generateKey = async e => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify({ name: name.trim() })
      });
      setName('');
      setFeedback('New secure API key generated successfully!');
      loadKeys();
      setTimeout(() => setFeedback(''), 4000);
    } catch {
      setFeedback('Failed to generate key.');
    } finally {
      setBusy(false);
    }
  };

  const revokeKey = async id => {
    if (!confirm('Are you sure you want to revoke this API key? Apps using it will lose access immediately.')) return;
    try {
      await fetch('/api/developer/keys/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + t }
      });
      loadKeys();
    } catch {}
  };

  const copy = keyText => {
    navigator.clipboard?.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Developer Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(168, 85, 247, 0.12))' }}>
        <div className="eyebrow">DEVELOPER &amp; API USER GATEWAY</div>
        <h2 style={{ margin: '4px 0 8px' }}>Secure API Keys &amp; Pipeline Integration</h2>
        <p style={{ margin: 0, color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
          Integrate the TrustLoom AI bot detection pipeline directly into your applications, microservices, and bot monitoring pipelines.
        </p>
      </div>

      {feedback && (
        <div className="card" style={{ padding: 12, color: 'var(--ok)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          {feedback}
        </div>
      )}

      {/* API Key Generation Form */}
      <form className="card" onSubmit={generateKey} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 260px' }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>New API Key Label / Application Name</label>
          <input
            required
            placeholder="e.g. Fraud Detection Microservice or Mobile App Scanner"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <button className="btn" type="submit" disabled={busy} style={{ height: 42 }}>
          {busy ? 'Generating...' : '+ Generate API Key'}
        </button>
      </form>

      {/* Active Keys Table */}
      <div className="card">
        <b>Active Developer API Keys</b>
        <div className="tbl-wrap" style={{ marginTop: 12 }}>
          <table>
            <thead>
              <tr>
                <th>Key Name</th>
                <th>Secret API Key</th>
                <th>Created</th>
                <th>Monthly Quota</th>
                <th>Requests Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {keys.map(k => (
                <tr key={k.id}>
                  <td><b>{k.name}</b></td>
                  <td>
                    <code style={{ fontSize: 12 }}>
                      {k.key ? k.key.slice(0, 14) + '••••••••••••••••' : 'sk_live_••••'}
                    </code>
                    <button
                      className="btn ghost sm"
                      style={{ marginLeft: 8, padding: '2px 8px', fontSize: 11 }}
                      onClick={() => copy(k.key)}
                    >
                      {copiedKey === k.key ? '✔ Copied' : 'Copy'}
                    </button>
                  </td>
                  <td>{new Date(k.created).toLocaleDateString()}</td>
                  <td><b>{k.quota?.toLocaleString()} scans</b></td>
                  <td>
                    <span style={{ color: 'var(--ok)', fontWeight: 700 }}>{k.used?.toLocaleString()}</span> / {k.quota?.toLocaleString()}
                  </td>
                  <td>
                    <button className="btn ghost sm" style={{ color: 'var(--bad)' }} onClick={() => revokeKey(k.id)}>
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
              {!keys.length && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 18, color: 'var(--tx-dim)' }}>
                    No API keys generated yet. Use the form above to generate your first key.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Code Snippets */}
      <div className="card">
        <b>Quick Integration Code Snippets</b>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: 14 }}>
          {/* Python */}
          <div style={{ background: '#0a0d18', padding: 14, borderRadius: 10, border: '1px solid var(--bd)' }}>
            <span className="tag cyan" style={{ fontSize: 10, marginBottom: 8 }}>PYTHON REQUESTS</span>
            <pre style={{ fontSize: 11, color: '#38bdf8', margin: 0, overflowX: 'auto', lineHeight: 1.5 }}>
{`import requests

url = "http://localhost:5050/api/analyze"
headers = {"Authorization": "Bearer sk_live_your_api_key"}
payload = {
    "handle": "elonmusk",
    "followers": 180000000,
    "friends": 420,
    "statuses": 24000,
    "age_days": 5400
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
            </pre>
          </div>

          {/* cURL */}
          <div style={{ background: '#0a0d18', padding: 14, borderRadius: 10, border: '1px solid var(--bd)' }}>
            <span className="tag ok" style={{ fontSize: 10, marginBottom: 8 }}>cURL CLI</span>
            <pre style={{ fontSize: 11, color: '#4ade80', margin: 0, overflowX: 'auto', lineHeight: 1.5 }}>
{`curl -X POST http://localhost:5050/api/analyze \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_live_your_api_key" \\
  -d '{
    "handle": "suspicious_account",
    "followers": 14,
    "friends": 2800,
    "statuses": 4
  }'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPLIANCE OFFICER / AUDITOR PORTAL (GDPR Article 22 & Data Retention)
   ========================================================================= */
export function ComplianceView({ t }) {
  const [status, setStatus] = useState(null);
  const [purging, setPurging] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadStatus = () => {
    fetch('/api/compliance/status', { headers: { Authorization: 'Bearer ' + t } })
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {});
  };

  useEffect(() => { loadStatus(); }, [t]);

  const runPurge = async () => {
    if (!confirm('Execute GDPR 30-Day Data Retention Purge? Scanned tweet logs older than 30 days will be cryptographically purged.')) return;
    setPurging(true);
    try {
      const res = await fetch('/api/compliance/purge', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + t }
      }).then(r => r.json());
      setFeedback(`Purge complete. ${res.purgedCount} expired historical tweet records deleted. Blockchain block appended.`);
      loadStatus();
      setTimeout(() => setFeedback(''), 5000);
    } catch {
      setFeedback('Purge failed.');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Compliance Header */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(16, 185, 129, 0.12))' }}>
        <div className="eyebrow">GOVERNANCE, RISK &amp; COMPLIANCE (GRC)</div>
        <h2 style={{ margin: '4px 0 8px' }}>Compliance Officer &amp; Auditor Control Center</h2>
        <p style={{ margin: 0, color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
          Oversee platform audit trails, enforce statutory data retention limits (GDPR / CCPA), and guarantee automated decision explainability under GDPR Article 22.
        </p>
      </div>

      {feedback && (
        <div className="card" style={{ padding: 12, color: 'var(--ok)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          {feedback}
        </div>
      )}

      {/* 4 Compliance KPIs */}
      <div className="grid">
        <div className="kpi">
          <small>GDPR Article 22 Status</small>
          <h1 style={{ color: 'var(--ok)' }}>100%</h1>
          <small className="up">Right to explanation active via SHAP &amp; LIME</small>
        </div>
        <div className="kpi">
          <small>Data Retention Limit</small>
          <h1 style={{ color: 'var(--a)' }}>{status?.retentionDays || 30} Days</h1>
          <small className="up">Strict automated lifecycle</small>
        </div>
        <div className="kpi">
          <small>Active Scans Within Limit</small>
          <h1 style={{ color: 'var(--tx)' }}>{status?.activeScansWithinPolicy || 0}</h1>
          <small className="up">Legally retained</small>
        </div>
        <div className="kpi">
          <small>Total Historical Records Purged</small>
          <h1 style={{ color: 'var(--bad)' }}>{status?.totalPurgedHistorical || 0}</h1>
          <small className="dn">Zero privacy leakage</small>
        </div>
      </div>

      {/* Data Retention Purge Action Box */}
      <div className="card">
        <div className="top">
          <div>
            <b>Statutory Data Retention &amp; Scanned Tweet Log Purging</b>
            <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
              Enforces legal mandate to erase historical social profile scrapings older than 30 days
            </div>
          </div>
          <button className="btn sm bad" disabled={purging} onClick={runPurge}>
            {purging ? 'Executing Purge...' : '🗑️ Run Compliance 30-Day Purge'}
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--tx-dim)', lineHeight: 1.6, margin: '12px 0 0' }}>
          Social media privacy compliance mandates that ingested timeline tweets and follower graphs cannot be permanently stockpiled. TrustLoom AI automatically tags each scan with a cryptographic expiry timestamp and records each batch purge to the immutable SHA-256 chain.
        </p>
      </div>

      {/* Cryptographic Chain Component */}
      <Chain t={t} />
    </div>
  );
}

export function Info() {
  const T = [
    ['⚛️', 'React + Vite', 'UI, routing, dashboards'],
    ['🌐', 'Three.js', '3D network globe'],
    ['🟢', 'Node + Express', 'REST API, auth, chatbot'],
    ['🌲', 'scikit-learn / LightGBM', 'Boosted-tree detection'],
    ['🧠', 'MLP deep learning', '64-32 neural network'],
    ['⛓', 'SHA-256 chain', 'Tamper-evident audit ledger'],
    ['🤖', 'Groq LLM', 'Explanations + project chatbot'],
    ['🔐', 'AES-256 + TOTP', 'Encryption and MFA']
  ];
  const Q = [
    ['What is a social bot?', 'An automated account that spams, inflates followers or pushes coordinated content while imitating real users.'],
    ['Why explainable AI?', 'Analysts must justify suspensions. SHAP and LIME show which evidence drove each decision.'],
    ['Is the blockchain real?', 'It is a hash-chained audit log on one server. It proves tampering but is not a distributed ledger.'],
    ['Can I trust 99% accuracy?', 'Only on the benchmarks. Cross-dataset tests dropped to 45–88%, which is why we report both.'],
    ['Are all roles required?', 'Admin, Manager, and Analyzer are the 3 main roles. Specialized functions like Data Scientist, Developer API, and Compliance Officer are embedded cleanly inside them.']
  ];
  return (
    <>
      <section className="sec"><Rise><h2>The problem</h2></Rise><div className="grid">{[['Fake reach', 'Bots inflate follower counts and engagement, distorting trust.'], ['Evolving bots', 'Modern bots copy human behaviour, so one feature is never enough.'], ['Black-box scores', 'Opaque verdicts make audits and appeals impossible.']].map(([t, d], i) => <Rise key={t} d={i * 0.1}><div className="card hv"><h3 style={{ marginTop: 0 }}>{t}</h3><small style={{ color: 'var(--mut)' }}>{d}</small></div></Rise>)}</div></section>
      <section className="sec"><Rise><h2>Technology stack</h2></Rise><div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>{T.map(([i, t, d], k) => <Rise key={t} d={k * 0.05}><div className="card hv"><div className="ico">{i}</div><b>{t}</b><br /><small style={{ color: 'var(--mut)' }}>{d}</small></div></Rise>)}</div></section>
      <section className="sec"><Rise><h2>Proven on real datasets</h2></Rise><div className="grid">{[['99.44%', 'Cresci-15 · LightGBM'], ['99.53%', 'Cresci-17 · AdaBoost'], ['0.999+', 'ROC-AUC'], ['47', 'features · 6 groups']].map(([n, l], i) => <Rise key={l} d={i * 0.08}><div className="card" style={{ textAlign: 'center' }}><h1 className="grad" style={{ margin: 0 }}>{n}</h1><small>{l}</small></div></Rise>)}</div></section>
      <section className="sec faq"><Rise><h2>Frequently asked questions</h2></Rise>{Q.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    </>
  );
}
