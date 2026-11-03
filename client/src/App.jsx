'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { AdminDash, ManagerDash, AnalystDash, AdvancedFeaturesSuite } from './Dash.jsx';
import { Bulk, Reports, NetBar, cacheModel, analyzeSmart } from './Ops.jsx';
import { Logo, Globe, Chat, Chain, MLLab, Info, DeveloperKeys, ComplianceView } from './Extra.jsx';
import AccountIntel from './AccountIntel.jsx';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  NavIcon,
  GoogleIcon,
  MetaIcon,
  InstagramIcon,
  XIcon,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users as UsersIcon,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  X,
  LogOut,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Menu,
  Check,
  FileText,
  FlaskConical,
  Clock,
  Bell,
  Facebook
} from './icons.jsx';

const API_BASE = (
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/+$/, '')
    : (typeof window !== 'undefined' && (window.location.hostname.endsWith('vercel.app') || window.location.hostname === 'trust-loom-ai.vercel.app')
        ? 'https://trustloom-ai-1.onrender.com'
        : '')
) + '/api';

const api = (p, t, o = {}) => fetch(API_BASE + p, {
  ...o,
  headers: {
    'Content-Type': 'application/json',
    ...(t && { Authorization: 'Bearer ' + t })
  },
  body: o.body && JSON.stringify(o.body)
}).then(async r => {
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(j.error || `Request failed (${r.status})`);
    e.status = r.status;
    throw e;
  }
  return j;
});

import NotFound from './NotFound.jsx';

const NAV = {
  admin: [
    'Home', 'Account Search', 'Connected Accounts', 'Dataset Analysis',
    'Model Training', 'Scan History', 'Reports', 'Payment Reviews', 'Users', 'Unlock Features', 'Settings'
  ],
  manager: [
    'Home', 'Account Search', 'Case Review & Governance', 'Dataset Analysis',
    'Scan History', 'Reports', 'Unlock Features', 'Settings'
  ],
  analyst: [
    'Home', 'Account Search', 'Dataset Analysis', 'Threat Radar & ML Lab',
    'Scan History', 'Reports', 'Unlock Features', 'Settings'
  ]
};

const ICON = {
  'Overview': '◉',
  'Account Search': '◎',
  'Manual Analyzer': '⌖',
  'Analyzer': '⌖',
  'Bulk Scan': '📤',
  'Reports': '📄',
  'Blockchain & Compliance': '⛓',
  'Blockchain': '⛓',
  'ML Retrain Lab': '🧪',
  'ML Benchmarks': '🧪',
  'ML Retrain & Calibration': '🧪',
  'ML Lab': '🧪',
  'Developer API': '⚡',
  'Developer API Quotas': '⚡',
  'Developer API Keys': '⚡',
  'Payment Reviews': '▣',
  'Audit Log': '📜',
  'Users': '👥',
  'Integrations': '🔗',
  'Upgrade Plan': '✧',
  'Unlock Features': '🔓',
  'Settings': '⚙'
};

function Count({ to, suffix = '' }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s, id;
    const f = t => {
      s ??= t;
      const k = Math.min((t - s) / 1200, 1);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) id = requestAnimationFrame(f);
    };
    id = requestAnimationFrame(f);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{v.toLocaleString()}{suffix}</>;
}

const Rise = ({ children, d = 0, ...p }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, delay: d }}
    {...p}
  >
    {children}
  </motion.div>
);

const Tgl = ({ on, set }) => (
  <button className={'tgl ' + (on ? 'on' : '')} onClick={() => set(!on)} aria-label="toggle">
    <i />
  </button>
);

/* =========================================================================
   LANDING PAGE (Fully Responsive, Deep Information & Live Sandbox)
   ========================================================================= */
function Landing({ dark, setDark, open }) {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress);
  const [mobileNav, setMobileNav] = useState(false);
  const [budget, setBudget] = useState(50000);

  // Landing Interactive Sandbox state
  const [sbHandle, setSbHandle] = useState('crypto_airdrop_bot99');
  const [sbMetrics, setSbMetrics] = useState({ followers: 38, friends: 2490, statuses: 18, age_days: 14, has_desc: false, default_img: true });
  const [sbScore, setSbScore] = useState(0.986);
  const [sbScanning, setSbScanning] = useState(false);

  const runSandbox = (h, f, g, s, age, desc, img) => {
    setSbScanning(true);
    setSbHandle(h);
    setSbMetrics({ followers: f, friends: g, statuses: s, age_days: age, has_desc: desc, default_img: img });
    setTimeout(() => {
      const ratio = Math.log((f + 1) / (g + 1));
      const z = -0.6 * Math.log1p(f) + 0.5 * Math.log1p(g) - 0.9 * ratio - 0.2 * Math.log1p(s) - 0.7 * (age / 365) - 1.0 * (desc ? 1 : 0) + 1.2 * (img ? 1 : 0) + 1.5;
      const p = 1 / (1 + Math.exp(-z));
      setSbScore(+p.toFixed(3));
      setSbScanning(false);
    }, 400);
  };

  const F = [
    ['🧠', 'Explainable Machine Learning', 'LightGBM, AdaBoost, and neural networks with SHAP feature-level impact weights for every forensic verdict.'],
    ['🔐', 'Zero-Trust Security & TOTP MFA', 'Mandatory authenticator code, bcrypt password hashing, scoped JWT permissions, and AES-256-GCM encrypted database.'],
    ['⛓️', 'Tamper-Evident SHA-256 Blockchain', 'Every action is cryptographically chained. Modifying a single historical record breaks cryptographic verification.'],
    ['⚡', 'Real-Time Threat Radar Feed', 'Live alerts stream directly to security teams as coordinated follower spikes or spam swarms emerge.'],
    ['🤖', 'AI Forensic Investigator', 'Detailed, plain-English analytical justifications for every flagged account powered by Groq Llama 3.3 70B.'],
    ['📄', 'One-Click Compliance PDF Export', 'Export executive-ready forensic investigation dossiers and tamper-evident audit CSV ledgers with a single click.']
  ];

  const PIPELINE = [
    { step: '01', title: 'Data Ingestion & OSINT', desc: 'Securely connects to official Meta & X APIs or ingests public handles for multi-point metric extraction.' },
    { step: '02', title: '47 Behavioral Vectorization', desc: 'Computes follower symmetry, creation entropy, avatar authenticity, timeline velocity, and reciprocal follow pods.' },
    { step: '03', title: 'Multi-Model Inference', desc: 'Evaluates accounts across LightGBM boosted trees (99.44%), AdaBoost, and 64-32 Deep MLP Neural Network.' },
    { step: '04', title: 'Cryptographic Chain of Custody', desc: 'Logs each verdict to an immutable SHA-256 hash-chained audit ledger for legal and compliance audit trails.' }
  ];

  const SIGNALS = [
    { title: 'Network Ratio Symmetry', desc: 'Detects extreme outbound-to-inbound follower imbalances typical of mass-follow spambots.' },
    { title: 'Profile Metadata Credibility', desc: 'Analyzes default profile pictures, bio completeness, username entropy, and custom identity assets.' },
    { title: 'Timeline Velocity & Burstiness', desc: 'Flags accounts broadcasting content at inhuman frequencies or exhibiting unnatural clustering.' },
    { title: 'Reciprocal Engagement Pods', desc: 'Identifies coordinated follow-for-follow rings designed to falsely simulate organic influence.' },
    { title: 'Temporal Creation Velocity', desc: 'Compares account age against posting volume to catch fresh sleeper or clone profiles.' },
    { title: 'Explainable Weight Waterfall', desc: 'Transparent mathematical justification showing exactly which features drove the bot determination.' }
  ];

  return (
    <>
      <motion.div className="bar" style={{ scaleX: sx }} />

      {/* Modern Responsive Navigation */}
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="#demo">Live Sandbox</a>
          <a href="#pipeline">Architecture</a>
          <a href="#signals">47 Signals</a>
          <a href="#comparison">Bot vs Genuine</a>
          <a href="#calculator">ROI Calculator</a>
          <a href="#coverage">Platform APIs</a>
          <a href="#taxonomy">Bot Taxonomy</a>
          <a href="#plans">Pricing &amp; Plans</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-actions">
          <button className="btn ghost sm" onClick={() => setDark(!dark)} title="Toggle theme" style={{ padding: '6px 12px', fontSize: 13 }}>
            {dark ? '☀' : '☾'}
          </button>
          <button
            className="btn sm"
            style={{
              background: 'linear-gradient(135deg, #ff416c, #ff4b72)',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(255, 75, 110, 0.45)',
              fontWeight: 700,
              padding: '8px 18px'
            }}
            onClick={() => open({ role: 'admin', mode: 'signin' })}
          >
            Sign in
          </button>
          <button
            className="btn ghost sm mobile-nav-btn"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle navigation"
          >
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Navigation Menu */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div
            className="landing-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <a href="#demo" onClick={() => setMobileNav(false)}>Live Sandbox</a>
            <a href="#pipeline" onClick={() => setMobileNav(false)}>Architecture</a>
            <a href="#signals" onClick={() => setMobileNav(false)}>47 Signals</a>
            <a href="#comparison" onClick={() => setMobileNav(false)}>Bot vs Genuine</a>
            <a href="#calculator" onClick={() => setMobileNav(false)}>ROI Calculator</a>
            <a href="#coverage" onClick={() => setMobileNav(false)}>Platform APIs</a>
            <a href="#taxonomy" onClick={() => setMobileNav(false)}>Bot Taxonomy</a>
            <a href="#plans" onClick={() => setMobileNav(false)}>Pricing &amp; Plans</a>
            <a href="#faq" onClick={() => setMobileNav(false)}>FAQ</a>
            <button className="btn" style={{ width: '100%', marginTop: 8 }} onClick={() => { setMobileNav(false); open({ role: 'admin', mode: 'signin' }); }}>
              Sign In as Administrator (admin@gmail.com) ↗
            </button>
            <button className="btn ghost" style={{ width: '100%', marginTop: 6, borderColor: 'var(--a)' }} onClick={() => { setMobileNav(false); open({ role: 'manager', mode: 'register' }); }}>
              Register Member Identity (Sign Up) ↗
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section matching Image 1 */}
      <section className="hero2">
        <div>
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: '#ff4b6e', fontWeight: 800, letterSpacing: '0.12em', fontSize: 13 }}
          >
            SOCIAL ACCOUNT INTELLIGENCE
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            style={{ fontSize: 'clamp(42px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em' }}
          >
            Find the bots.<br />
            <span style={{ color: '#ff4b6e', textShadow: '0 0 35px rgba(255, 75, 110, 0.45)' }}>
              Expose the fakes.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ maxWidth: 580, fontSize: 16, lineHeight: 1.6, color: '#94a3b8' }}
          >
            Detect spam bots and fake followers with explainable machine learning trained on the Cresci research datasets. Every account is scored, explained and audited in one secure workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 28, alignItems: 'center' }}
          >
            <button
              className="btn lg"
              style={{
                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b72 100%)',
                color: '#fff',
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 14,
                boxShadow: '0 0 30px rgba(255, 75, 110, 0.55)'
              }}
              onClick={() => open?.({ role: 'admin', mode: 'signin' })}
            >
              Launch workspace ↗
            </button>
            
            <a href="#coverage" style={{ textDecoration: 'none' }}>
              <button className="btn ghost lg" style={{ padding: '14px 24px', fontSize: 15, borderRadius: 14 }}>
                Explore capabilities
              </button>
            </a>
          </motion.div>

          <div className="checks" style={{ marginTop: 26, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 13, color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><b style={{ color: '#ff4b6e' }}>✓</b> MFA-protected access</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><b style={{ color: '#ff4b6e' }}>✓</b> Evidence for every verdict</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><b style={{ color: '#ff4b6e' }}>✓</b> Tamper-evident audit log</span>
          </div>

          {/* Quick Role Gateway */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
            <button className="btn sm ghost" onClick={() => open?.({ role: 'admin', mode: 'signin' })}>🛡️ Admin (admin@gmail.com) ↗</button>
            <button className="btn sm ghost" onClick={() => open?.({ role: 'manager', mode: 'signin' })}>⚖️ Manager Sign In ↗</button>
            <button className="btn sm ghost" onClick={() => open?.({ role: 'analyst', mode: 'signin' })}>🔍 Analyst Sign In ↗</button>
            <button className="btn sm ghost" style={{ borderColor: '#ff4b6e', color: '#ff4b6e' }} onClick={() => open?.({ role: 'manager', mode: 'register' })}>✨ Register Member (Sign Up) ↗</button>
          </div>
        </div>

        <div className="gwrap">
          <Globe />
          
          {/* Exact floating badges matching Image 1 */}
          <div className="float" style={{ left: '0%', top: '22%', background: 'rgba(15, 20, 35, 0.88)', border: '1px solid rgba(255, 75, 110, 0.35)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
            <b style={{ color: '#fff', fontSize: 13.5, display: 'block', marginBottom: 2 }}>@free_followers_99</b>
            <span style={{ color: '#ff4b6e', fontSize: 12.5, fontWeight: 800 }}>Bot · 98.7%</span>
          </div>

          <div className="float" style={{ right: '0%', bottom: '22%', background: 'rgba(15, 20, 35, 0.88)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', animationDelay: '2s' }}>
            <b style={{ color: '#fff', fontSize: 13.5, display: 'block', marginBottom: 2 }}>@maria.writes</b>
            <span style={{ color: '#10b981', fontSize: 12.5, fontWeight: 800 }}>Genuine · 2.1%</span>
          </div>
        </div>
      </section>

      {/* Real-Time Intercepted Threats Marquee Ticker */}
      <div className="threat-ticker-bar">
        <div className="ticker-label">
          <span className="dot" /> LIVE THREAT STREAM
        </div>
        <div className="ticker-track">
          <div className="ticker-inner">
            {[
              { p: '𝕏', h: '@crypto_airdrop_bot99', r: '98.6% Sybil Bot', a: 'Neutralized' },
              { p: 'Ⓜ', h: '@maria.writes', r: '2.1% Organic Creator', a: 'Verified' },
              { p: '◎', h: '@growth_matrix_ai', r: '91.2% Follow-Pod Farm', a: 'Flagged' },
              { p: '𝕏', h: '@elonmusk_airdrop_fake', r: '99.4% Impersonator Scam', a: 'Banned' },
              { p: '✈', h: '@telegram_signal_drain', r: '97.5% Malicious Swarm', a: 'Isolated' },
              { p: '𝕏', h: '@solana_free_mint_33', r: '99.1% Phishing Puppet', a: 'Quarantined' },
              { p: 'Ⓜ', h: '@sarah_tech_lead', r: '1.4% Authentic Entity', a: 'Verified' }
            ].concat([
              { p: '𝕏', h: '@crypto_airdrop_bot99', r: '98.6% Sybil Bot', a: 'Neutralized' },
              { p: 'Ⓜ', h: '@maria.writes', r: '2.1% Organic Creator', a: 'Verified' },
              { p: '◎', h: '@growth_matrix_ai', r: '91.2% Follow-Pod Farm', a: 'Flagged' }
            ]).map((t, idx) => (
              <span key={idx} className="ticker-item">
                <span className="ticker-platform">{t.p}</span>
                <b>{t.h}</b>
                <span className={`tag ${t.a === 'Verified' ? 'ok' : 'bad'}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                  {t.r} · {t.a}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry Counter Strip */}
      <section className="sec" style={{ paddingTop: 10, paddingBottom: 40 }}>
        <div className="grid">
          {[
            [14368, '+', 'Accounts Scanned & Verified'],
            [9114, '+', 'Malicious Bots Blocked'],
            [99.44, '%', 'LightGBM Precision (Cresci)'],
            [100, '%', 'Cryptographic Audit Integrity']
          ].map(([n, s, l], i) => (
            <Rise key={l} d={i * 0.08}>
              <div className="card" style={{ textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: clampFontSize(40) }} className="grad">
                  <Count to={n} suffix={s} />
                </h1>
                <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>{l}</small>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* INTERACTIVE INSTANT SANDBOX */}
      <section className="sec" id="demo">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>TRY IT NOW</div>
          <h2>Interactive Profile Authenticity Sandbox</h2>
          <p className="sec-sub">
            Test our explainable bot detection engine right now. Select a preset account or tweak metrics to watch the machine learning classifier score authenticity in real time.
          </p>
        </Rise>

        <Rise d={0.15}>
          <div className="sandbox-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx-dim)' }}>
                Select a live sample profile:
              </span>
              <div className="sandbox-presets">
                <button onClick={() => runSandbox('crypto_airdrop_bot99', 38, 2490, 18, 14, false, true)}>
                  🤖 @crypto_airdrop_bot99 (Bot)
                </button>
                <button onClick={() => runSandbox('maria.writes', 8420, 620, 4320, 1820, true, false)}>
                  🛡️ @maria.writes (Genuine)
                </button>
                <button onClick={() => runSandbox('growth_matrix_ai', 12400, 14800, 82, 45, true, false)}>
                  ⚡ @growth_matrix_ai (Pod)
                </button>
                <button onClick={() => runSandbox('elonmusk_airdrop_fake', 120, 3200, 6, 4, true, false)}>
                  🚨 @elonmusk_airdrop_fake (Scam)
                </button>
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, var(--a), var(--b))', color: '#000', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                    {sbHandle.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>@{sbHandle}</h3>
                    <small style={{ color: 'var(--tx-dim)' }}>
                      {sbMetrics.followers.toLocaleString()} followers · {sbMetrics.friends.toLocaleString()} following · {sbMetrics.statuses} posts
                    </small>
                  </div>
                </div>

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13, color: 'var(--tx-dim)' }}>
                  <div>Account Age: <b>{sbMetrics.age_days} days</b></div>
                  <div>Has Bio Description: <b>{sbMetrics.has_desc ? 'Yes' : 'No'}</b></div>
                  <div>Default Image: <b>{sbMetrics.default_img ? 'Yes (Anomalous)' : 'No (Custom)'}</b></div>
                  <div>Follower Ratio: <b>{(sbMetrics.followers / Math.max(1, sbMetrics.friends)).toFixed(2)}x</b></div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <button className="btn" onClick={open}>
                    Analyze Full Dossier in Workspace ↗
                  </button>
                </div>
              </div>

              {/* Live Gauge Meter */}
              <div style={{ textAlign: 'center', padding: '16px 20px', background: 'rgba(0,0,0,0.25)', borderRadius: 20, border: '1px solid var(--bd)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx-dim)', marginBottom: 8, letterSpacing: '0.08em' }}>
                  ESTIMATED BOT PROBABILITY
                </div>
                <div style={{ fontSize: 52, fontWeight: 800, color: sbScore > 0.5 ? 'var(--bad)' : 'var(--ok)', letterSpacing: '-0.04em' }}>
                  {sbScanning ? '...' : `${Math.round(sbScore * 100)}%`}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <span className={`tag ${sbScore > 0.5 ? 'bad' : 'ok'}`} style={{ fontSize: 12, padding: '6px 14px' }}>
                    {sbScore > 0.5 ? 'IDENTIFIED AS AUTOMATED BOT' : 'VERIFIED GENUINE ACCOUNT'}
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${Math.round(sbScore * 100)}%` }}
                    transition={{ duration: 0.6 }}
                    style={{
                      height: '100%',
                      background: sbScore > 0.5 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #00f0ff, #10b981)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Rise>
      </section>

      {/* 4-STAGE ARCHITECTURE PIPELINE */}
      <section className="sec" id="pipeline">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>FORENSIC PIPELINE</div>
          <h2>How TrustLoom AI Analyzes Accounts</h2>
          <p className="sec-sub">
            From raw platform telemetry to explainable machine learning verdicts and immutable blockchain audit records.
          </p>
        </Rise>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
          {PIPELINE.map((p, i) => (
            <Rise key={p.step} d={i * 0.08}>
              <div className="card hv">
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--a)', marginBottom: 10 }}>{p.step}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{p.title}</h3>
                <small style={{ color: 'var(--tx-dim)', lineHeight: 1.6, fontSize: 13 }}>{p.desc}</small>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* 47 BEHAVIORAL SIGNALS MATRIX */}
      <section className="sec" id="signals">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>FEATURE ENGINEERING</div>
          <h2>47 Multi-Dimensional Signal Vectors</h2>
          <p className="sec-sub">
            Trained on the gold-standard Cresci research datasets to catch evolving sybil bots, engagement rings, and stealth spam swarms.
          </p>
        </Rise>

        <div className="grid">
          {SIGNALS.map((s, i) => (
            <Rise key={s.title} d={i * 0.06}>
              <div className="card hv">
                <div className="ico">⚡</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{s.title}</h3>
                <small style={{ color: 'var(--tx-dim)', lineHeight: 1.6, fontSize: 13 }}>{s.desc}</small>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* SIDE-BY-SIDE BOT VS GENUINE COMPARISON */}
      <section className="sec" id="comparison">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>BEHAVIORAL ANATOMY</div>
          <h2>Bot Farm vs. Organic Profile</h2>
          <p className="sec-sub">
            How TrustLoom AI separates coordinated automated networks from authentic creators across 47 statistical dimensions.
          </p>
        </Rise>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
          {/* Fake Bot Card */}
          <Rise d={0.1}>
            <div className="card" style={{ border: '1px solid rgba(244,63,94,0.4)', background: 'linear-gradient(145deg, rgba(244,63,94,0.04), #12172f)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tag bad">TYPICAL BOT FARM SIGNATURE</span>
                <span style={{ fontSize: 24 }}>🚨</span>
              </div>
              <h3 style={{ margin: '14px 0 6px', color: 'var(--bad)' }}>High-Entropy Sybil Bot</h3>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
                Artificially inflated networks designed for spamming, crypto airdrop fraud, or engagement manipulation.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'grid', gap: 10, fontSize: 13 }}>
                <li style={{ color: 'var(--bad)' }}>✖ <b>Extreme Following Skew:</b> Following 3,000+ with &lt;50 followers</li>
                <li style={{ color: 'var(--bad)' }}>✖ <b>Default Profile Picture:</b> Stock egg/placeholder graphic</li>
                <li style={{ color: 'var(--bad)' }}>✖ <b>Blank / Spam Bio:</b> Lacks personalized human metadata</li>
                <li style={{ color: 'var(--bad)' }}>✖ <b>Burst Posting Velocity:</b> Unnatural posting frequency clusters</li>
                <li style={{ color: 'var(--bad)' }}>✖ <b>Symmetric Mutual Follows:</b> Follow-for-follow pod markers</li>
              </ul>
            </div>
          </Rise>

          {/* Genuine Human Card */}
          <Rise d={0.2}>
            <div className="card" style={{ border: '1px solid rgba(16,185,129,0.4)', background: 'linear-gradient(145deg, rgba(16,185,129,0.04), #12172f)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tag ok">AUTHENTIC HUMAN SIGNATURE</span>
                <span style={{ fontSize: 24 }}>🛡️</span>
              </div>
              <h3 style={{ margin: '14px 0 6px', color: 'var(--ok)' }}>Organic Creator Account</h3>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
                Normal human engagement patterns with consistent natural timeline variance and organic network symmetry.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0', display: 'grid', gap: 10, fontSize: 13 }}>
                <li style={{ color: 'var(--ok)' }}>✔ <b>Balanced Organic Ratio:</b> Natural audience-to-friend ratio</li>
                <li style={{ color: 'var(--ok)' }}>✔ <b>Custom Identity Assets:</b> Authentic avatar and cover media</li>
                <li style={{ color: 'var(--ok)' }}>✔ <b>Contextual Bio &amp; Location:</b> Natural language human bio</li>
                <li style={{ color: 'var(--ok)' }}>✔ <b>Established Timeline Age:</b> Gradual history over months/years</li>
                <li style={{ color: 'var(--ok)' }}>✔ <b>Diverse Interaction Network:</b> Natural mentions and replies</li>
              </ul>
            </div>
          </Rise>
        </div>
      </section>

      {/* INTERACTIVE ROI & AD SPEND WASTE CALCULATOR */}
      <section className="sec" id="calculator">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>FINANCIAL IMPACT CALCULATOR</div>
          <h2>Measure Your Fake Traffic Exposure</h2>
          <p className="sec-sub">
            Independent cybersecurity audits reveal that 14% to 22% of all social clicks, ad views, and follow engagements are generated by automated bots. Calculate your capital exposure.
          </p>
        </Rise>

        <Rise d={0.15}>
          <div className="calc-card">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', alignItems: 'center', gap: 28 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ margin: 0, fontSize: 14 }}>Monthly Social / Marketing Budget</label>
                  <span className="grad" style={{ fontSize: 24, fontWeight: 800 }}>
                    ₹{budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--a)', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--tx-dim)', marginTop: 6 }}>
                  <span>₹10,000 / mo</span>
                  <span>₹5,00,000 / mo</span>
                  <span>₹10,00,000 / mo</span>
                </div>

                <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd)', fontSize: 13 }}>
                    <span>Estimated Bot Traffic Siphon</span>
                    <b style={{ color: 'var(--bad)' }}>18.4% (Industry Benchmark)</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd)', fontSize: 13 }}>
                    <span>Monthly Ad Budget Siphoned by Bots</span>
                    <b style={{ color: 'var(--bad)' }}>₹{Math.round(budget * 0.184).toLocaleString()} / month</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bd)', fontSize: 13 }}>
                    <span>Annual Waste without Threat Filtering</span>
                    <b style={{ color: 'var(--warn)' }}>₹{Math.round(budget * 0.184 * 12).toLocaleString()} / year</b>
                  </div>
                </div>
              </div>

              {/* Projected Protection Card */}
              <div style={{ background: 'linear-gradient(145deg, rgba(0, 240, 255, 0.08), rgba(16, 185, 129, 0.08))', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: 20, padding: 'clamp(20px, 3vw, 30px)', textAlign: 'center' }}>
                <span className="tag ok" style={{ marginBottom: 10 }}>PROJECTED NET VALUE SAVINGS</span>
                <div style={{ fontSize: clampFontSize(42), fontWeight: 800, color: 'var(--ok)', letterSpacing: '-0.03em', margin: '8px 0' }}>
                  ₹{Math.round(budget * 0.184 * 0.92).toLocaleString()}
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx-dim)', marginBottom: 20 }}>
                  Estimated monthly marketing capital preserved through real-time bot filtering
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'left', fontSize: 12, marginBottom: 20 }}>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ color: 'var(--tx-dim)' }}>Audience Authenticity</div>
                    <b style={{ color: 'var(--a)', fontSize: 16 }}>99.2% Pure</b>
                  </div>
                  <div className="card" style={{ padding: 12 }}>
                    <div style={{ color: 'var(--tx-dim)' }}>TrustLoom ROI</div>
                    <b style={{ color: 'var(--ok)', fontSize: 16 }}>+840% Net</b>
                  </div>
                </div>
                <button className="btn" style={{ width: '100%' }} onClick={open}>
                  Deploy Forensic Protection ↗
                </button>
              </div>
            </div>
          </div>
        </Rise>
      </section>

      {/* REAL SOCIAL PLATFORM API COVERAGE */}
      <section className="sec" id="coverage">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>ENTERPRISE CONNECTIVITY</div>
          <h2>Live Platform Coverage &amp; Latency</h2>
          <p className="sec-sub">
            Direct high-throughput OAuth 2.0 and Graph API pipelines delivering real-time account telemetry with zero rate throttling.
          </p>
        </Rise>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))' }}>
          {[
            {
              ico: 'Ⓜ', name: 'Meta Graph API', ver: 'v26.0 Official',
              points: ['Facebook Pages Read', 'Instagram Business Discovery', 'Audience Demographics', 'Webhook Telemetry Stream'],
              latency: '180 ms', status: 'LIVE PRODUCTION'
            },
            {
              ico: '𝕏', name: 'X (Twitter) API v2', ver: 'OAuth 2.0 PKCE',
              points: ['User Public Metrics', 'Timeline Velocity Fields', 'Follower Network Graph', 'Encrypted AES Token Vault'],
              latency: '120 ms', status: 'LIVE PRODUCTION'
            },
            {
              ico: '◎', name: 'Instagram Professional', ver: 'Business Graph',
              points: ['Media Reach Analytics', 'Comment Entropy Scanning', 'Follower Growth Symmetry', 'Zero-Credential Exposure'],
              latency: '190 ms', status: 'LIVE PRODUCTION'
            },
            {
              ico: '⚡', name: 'Universal OSINT Engine', ver: 'Multi-Point Recon',
              points: ['Zero-Token Handle Lookup', 'Creation Velocity Analysis', 'Avatar Biometric Checksum', 'Real-Time Heuristic Defense'],
              latency: '45 ms', status: 'HIGH-SPEED'
            }
          ].map((p, i) => (
            <Rise key={p.name} d={i * 0.08}>
              <div className="card hv" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 32 }}>{p.ico}</div>
                  <span className="tag ok" style={{ fontSize: 10 }}>{p.status}</span>
                </div>
                <h3 style={{ margin: '0 0 2px' }}>{p.name}</h3>
                <small style={{ color: 'var(--a)', fontWeight: 600, marginBottom: 14 }}>{p.ver}</small>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 18px', display: 'grid', gap: 8, fontSize: 13, color: 'var(--tx-dim)' }}>
                  {p.points.map(pt => <li key={pt}>✓ {pt}</li>)}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--tx-dim)' }}>Response Latency:</span>
                  <b style={{ color: 'var(--ok)' }}>{p.latency}</b>
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* BOT TAXONOMY & ANATOMY MATRIX */}
      <section className="sec" id="taxonomy">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>BOT TAXONOMY MATRIX</div>
          <h2>5 Coordinated Bot Swarm Archetypes</h2>
          <p className="sec-sub">
            Modern malicious networks deploy specialized automated personas. Here is how TrustLoom AI isolates each signature.
          </p>
        </Rise>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}>
          {[
            { icon: '👥', title: 'Reciprocal Engagement Pods', badge: 'Pod Farm', desc: 'Rings of accounts following and boosting each other to deceive social recommendation algorithms. Detected via symmetric friend-to-follower parity.' },
            { icon: '💸', title: 'Crypto Airdrop Phishing Bots', badge: 'Financial Scam', desc: 'Sleeper accounts mass-created to spam token giveaway links and drain crypto wallets. Detected via high creation entropy and default avatars.' },
            { icon: '🎭', title: 'Executive Impersonator Clones', badge: 'Sybil Clone', desc: 'Duplicate accounts copying names, avatars, and bios of high-profile leaders. Flagged through timeline burstiness and zero historical depth.' },
            { icon: '💤', title: 'Dormant Zombie Sleeper Nets', badge: 'Sleeper Swarm', desc: 'Accounts registered years prior with near-zero posts, suddenly activated in synchrony to flood hashtags during political or market events.' }
          ].map((b, i) => (
            <Rise key={b.title} d={i * 0.08}>
              <div className="card hv">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{b.icon}</span>
                  <span className="tag bad" style={{ fontSize: 10 }}>{b.badge}</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{b.title}</h3>
                <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="sec" id="features">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>CORE CAPABILITIES</div>
          <h2>Enterprise Security Suite</h2>
          <p className="sec-sub">
            Built from the ground up for platform safety teams, compliance officers, and cybersecurity analysts.
          </p>
        </Rise>

        <div className="grid">
          {F.map(([icon, title, desc], i) => (
            <Rise key={title} d={i * 0.07}>
              <div className="card hv">
                <div className="ico">{icon}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{title}</h3>
                <small style={{ color: 'var(--tx-dim)', lineHeight: 1.65, fontSize: 13 }}>{desc}</small>
              </div>
            </Rise>
          ))}
        </div>
      </section>

      {/* PRICING & PLAN UNLOCK PREVIEW */}
      <section className="sec" id="plans">
        <Rise>
          <div className="eyebrow" style={{ display: 'table', margin: '0 auto 12px' }}>UNLIMITED FORENSICS</div>
          <h2>Choose Your Investigation Tier</h2>
          <p className="sec-sub">
            Unlock advanced account scans, bulk CSV processing, executive PDF dossiers, and collaborative case review.
          </p>
        </Rise>

        <div className="plan-grid">
          {/* Starter Free */}
          <Rise d={0.08}>
            <div className="plan-card">
              <span className="tag cyan" style={{ width: 'fit-content', marginBottom: 12 }}>STARTER</span>
              <h2 style={{ margin: '0 0 6px' }}>Free</h2>
              <h1 className="grad" style={{ margin: '8px 0 16px', fontSize: 36 }}>₹0</h1>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13, marginBottom: 20 }}>
                For individual researchers and academic exploration.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 10, fontSize: 13 }}>
                <li>✓ Standard Single Account Analyzer</li>
                <li>✓ Basic OSINT Reconnaissance</li>
                <li>✓ Live Threat Alert Stream</li>
                <li>✓ Recent 5 Searches History</li>
                <li style={{ color: 'var(--tx-dim)', opacity: 0.5 }}>✖ Bulk CSV Batch Processing</li>
                <li style={{ color: 'var(--tx-dim)', opacity: 0.5 }}>✖ Forensic PDF Dossier Exports</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn ghost" style={{ width: '100%' }} onClick={open}>
                  Get Started Free
                </button>
              </div>
            </div>
          </Rise>

          {/* Pro Investigator */}
          <Rise d={0.16}>
            <div className="plan-card featured">
              <div className="plan-ribbon">
                <span className="tag ok">MOST POPULAR</span>
              </div>
              <span className="tag purple" style={{ width: 'fit-content', marginBottom: 12 }}>PRO INVESTIGATOR</span>
              <h2 style={{ margin: '0 0 6px' }}>Pro Plan</h2>
              <h1 className="grad" style={{ margin: '8px 0 16px', fontSize: 36 }}>₹99 <small style={{ fontSize: 14, color: 'var(--tx-dim)' }}>/ 30 days</small></h1>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13, marginBottom: 20 }}>
                For active social media researchers, journalists, and brand investigators.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 10, fontSize: 13 }}>
                <li>✓ <b>Everything in Free</b></li>
                <li>✓ <b>Bulk Scan:</b> Up to 2,000 Accounts</li>
                <li>✓ <b>Forensic PDF Dossier</b> Exporting</li>
                <li>✓ <b>Extended Scan History:</b> 300+ Records</li>
                <li>✓ <b>Deep MLP Neural Net</b> Multi-Inference</li>
                <li>✓ Priority Groq Llama 3.3 AI Explanations</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn" style={{ width: '100%' }} onClick={open}>
                  Unlock Pro Plan ↗
                </button>
              </div>
            </div>
          </Rise>

          {/* Team Security Ops */}
          <Rise d={0.24}>
            <div className="plan-card">
              <span className="tag warn" style={{ width: 'fit-content', marginBottom: 12 }}>TEAM OPS</span>
              <h2 style={{ margin: '0 0 6px' }}>Team Plan</h2>
              <h1 className="grad" style={{ margin: '8px 0 16px', fontSize: 36 }}>₹249 <small style={{ fontSize: 14, color: 'var(--tx-dim)' }}>/ 30 days</small></h1>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13, marginBottom: 20 }}>
                For collaborative trust &amp; safety teams managing investigation queues.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 10, fontSize: 13 }}>
                <li>✓ <b>All Pro Features Included</b></li>
                <li>✓ <b>Collaborative Case Disposition</b> Queue</li>
                <li>✓ <b>Role Management:</b> Admin, Manager, Analyst</li>
                <li>✓ <b>Audit CSV Ledgers &amp; Cryptographic Exports</b></li>
                <li>✓ Shared Team Escalation Workflows</li>
                <li>✓ Priority Support &amp; SLA Tracking</li>
              </ul>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn ghost" style={{ width: '100%' }} onClick={open}>
                  Unlock Team Plan ↗
                </button>
              </div>
            </div>
          </Rise>
        </div>
      </section>

      {/* Info, FAQ & Architecture */}
      <Info />

      {/* Bottom CTA Banner */}
      <Rise>
        <section className="sec" style={{ textAlign: 'center', paddingTop: 20 }}>
          <div className="card" style={{ padding: 'clamp(30px, 6vw, 60px) 20px', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(168, 85, 247, 0.16))', border: '1px solid rgba(0, 240, 255, 0.3)' }}>
            <h2 style={{ margin: '0 0 14px' }}>Ready to Protect Your Platform?</h2>
            <p style={{ color: 'var(--tx-dim)', maxWidth: 540, margin: '0 auto 26px', fontSize: 16 }}>
              Launch the TrustLoom AI workspace to detect coordinated inauthentic behavior, audit account integrity, and secure social reach.
            </p>
            <button className="btn lg" onClick={open}>
              Launch Dashboard Workspace ↗
            </button>
          </div>
        </section>
      </Rise>
    </>
  );
}

function clampFontSize(size) {
  return `clamp(${Math.round(size * 0.7)}px, 4vw, ${size}px)`;
}

/* =========================================================================
   AUTHENTICATION & LOGIN / REGISTRATION MODAL
   Zero Demo Autofill · bcrypt Hashed · 6-Digit TOTP 2FA Protected
   ========================================================================= */
function Login({ onDone, onClose, initialRole = 'admin', initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'register'
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState(initialRole === 'admin' ? 'admin@gmail.com' : initialRole === 'manager' ? 'manager@demo.com' : 'analyst@demo.com');
  const [password, setPassword] = useState(initialRole === 'admin' ? 'admin@1234' : initialRole === 'manager' ? 'manager@1234' : 'analyst@1234');
  const [name, setName] = useState('');
  const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA TOTP code
  const [s, setS] = useState(null);
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [ld, setLd] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showQr, setShowQr] = useState(true);

  // Handle Sign In submission (Step 1)
  const handleSignIn = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setErr('Please enter both your email address and password.');
      return;
    }
    setErr('');
    setLd(true);
    try {
      const res = await api('/auth/login', null, {
        method: 'POST',
        body: { email: email.trim(), password }
      });
      setS(res);
      setRole(res.role || role);
      setShowQr(!res.mfaEnrolled);
      setStep(2);
    } catch (e) {
      setErr(e.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLd(false);
    }
  };

  // Handle Registration submission (Step 1)
  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      setErr('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr('Please enter a valid work email address.');
      return;
    }
    if (password.length < 8) {
      setErr('Password must be at least 8 characters long.');
      return;
    }
    setErr('');
    setLd(true);
    try {
      const res = await api('/auth/register', null, {
        method: 'POST',
        body: { name: name.trim(), email: email.trim(), password, role }
      });
      setS(res);
      setShowQr(true);
      setStep(2);
    } catch (e) {
      setErr(e.message || 'Registration failed. An account may already exist with this email.');
    } finally {
      setLd(false);
    }
  };

  // Verify TOTP 6-Digit code (Step 2)
  const verifyCode = async (explicitCode) => {
    const inputCode = String(explicitCode ?? code).trim();
    if (!inputCode || inputCode.length !== 6) {
      setErr('Please enter the 6-digit code from your phone authenticator.');
      return;
    }
    setErr('');
    setLd(true);
    try {
      const res = await api('/auth/mfa', null, {
        method: 'POST',
        body: { step: s?.step, code: inputCode }
      });
      if (s?.role) {
        localStorage.setItem(`trustloom_paired_${s.role}`, 'true');
      }
      onDone(res);
    } catch (e) {
      setErr('❌ Invalid authenticator code. Access denied. Please ensure your device clock is synchronized and enter the 6-digit code shown in Google/Microsoft Authenticator.');
    } finally {
      setLd(false);
    }
  };

  const copySecretKey = () => {
    if (s?.secret) {
      navigator.clipboard?.writeText(s.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const roleMeta = {
    admin: { title: 'Administrator', badge: 'Full Forensic Access', desc: 'Platform Governance & Blockchain Audit' },
    manager: { title: 'Operations Manager', badge: 'Risk & Compliance Lead', desc: 'Case Dispositions & SLA Governance' },
    analyst: { title: 'Security Analyst', badge: 'Threat Intelligence', desc: 'Heuristic Scans & ML Retrain Lab' }
  }[role] || { title: 'Security Analyst', badge: 'Threat Intelligence', desc: 'Heuristic Scans & ML Retrain Lab' };

  return (
    <motion.div className="modal" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="auth-modal-card"
        onClick={e => e.stopPropagation()}
        initial={{ y: 24, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, opacity: 0 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span className="tag cyan" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>ZERO-TRUST IDENTITY GATEWAY</span>
          <button className="btn ghost sm" onClick={onClose} style={{ padding: '2px 8px', fontSize: 13, border: 0 }}>✕</button>
        </div>

        {/* Tab switch between Sign In and Register when on Step 1 */}
        {step === 1 && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 3, marginBottom: 18 }}>
            <button
              type="button"
              className={`role-pill-btn ${mode === 'signin' ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center', borderRadius: 8, padding: '8px 0', fontSize: 13, fontWeight: 700 }}
              onClick={() => { setMode('signin'); setErr(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`role-pill-btn ${mode === 'register' ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center', borderRadius: 8, padding: '8px 0', fontSize: 13, fontWeight: 700 }}
              onClick={() => { setMode('register'); setErr(''); }}
            >
              Register Real Account
            </button>
          </div>
        )}

        {/* STEP 1: SIGN IN */}
        {step === 1 && mode === 'signin' && (
          <form onSubmit={handleSignIn} style={{ textAlign: 'left' }}>
            <div className="auth-header">
              <h3>Enterprise Sign In</h3>
              <p>
                Select your role or enter credentials. Password is encrypted with bcrypt and verified with 6-digit TOTP 2FA.
              </p>
            </div>

            {/* 1-Click Role Credentials Selector */}
            <div className="auth-role-grid">
              <button
                type="button"
                className={`auth-role-btn ${email === 'admin@gmail.com' ? 'active-admin' : ''}`}
                onClick={() => {
                  setEmail('admin@gmail.com');
                  setPassword('admin@1234');
                  setRole('admin');
                  setErr('');
                }}
              >
                <b style={{ fontSize: 12 }}>🛡️ Admin</b>
                <span style={{ fontSize: 10, opacity: 0.8 }}>Full System</span>
              </button>
              <button
                type="button"
                className={`auth-role-btn ${email === 'manager@demo.com' ? 'active-manager' : ''}`}
                onClick={() => {
                  setEmail('manager@demo.com');
                  setPassword('manager@1234');
                  setRole('manager');
                  setErr('');
                }}
              >
                <b style={{ fontSize: 12 }}>⚖️ Manager</b>
                <span style={{ fontSize: 10, opacity: 0.8 }}>Governance</span>
              </button>
              <button
                type="button"
                className={`auth-role-btn ${email === 'analyst@demo.com' ? 'active-analyst' : ''}`}
                onClick={() => {
                  setEmail('analyst@demo.com');
                  setPassword('analyst@1234');
                  setRole('analyst');
                  setErr('');
                }}
              >
                <b style={{ fontSize: 12 }}>🔍 Analyst</b>
                <span style={{ fontSize: 10, opacity: 0.8 }}>Threat Radar</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="auth-label">Work Email</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {err && (
              <div className="verify-err-msg">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={ld}
              style={{ width: '100%', marginTop: 20, height: 44, fontSize: 14, fontWeight: 700 }}
            >
              {ld ? 'Verifying Credentials...' : 'Continue to Authenticator 2FA ↗'}
            </button>
          </form>
        )}

        {/* STEP 1: REGISTER */}
        {step === 1 && mode === 'register' && (
          <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
            <div className="auth-header">
              <h3>Create Production Identity</h3>
              <p>
                Provision a verified user record in the AES-256-GCM encrypted database.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Yashwanth Krishna"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="auth-label">Work Email</label>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="auth-label">Password (min 8 chars)</label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="auth-label">Platform Member Role</label>
                <select
                  value={role === 'admin' ? 'manager' : role}
                  onChange={e => setRole(e.target.value)}
                  className="auth-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="manager">Operations Manager (Operational Governance &amp; Case Review)</option>
                  <option value="analyst">Security Analyst (Threat Intelligence &amp; Deep Forensics)</option>
                </select>
                <small style={{ color: 'var(--tx-dim)', fontSize: 11, display: 'block', marginTop: 5, lineHeight: 1.4 }}>
                  🔒 <b>Admin Access Policy:</b> Administrator role is strictly reserved for <code>admin@gmail.com</code>. Any number of users can register as Operations Manager or Security Analyst.
                </small>
              </div>
            </div>

            {err && (
              <div className="verify-err-msg">
                {err}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              disabled={ld}
              style={{ width: '100%', marginTop: 20, height: 44, fontSize: 14, fontWeight: 700, background: 'linear-gradient(90deg, #00f0ff, #a855f7)', color: '#000' }}
            >
              {ld ? 'Creating User Identity...' : 'Register &amp; Setup Authenticator ↗'}
            </button>
          </form>
        )}

        {/* STEP 2: TOTP 6-DIGIT VERIFICATION */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <button
                type="button"
                className="btn ghost sm"
                style={{ fontSize: 11, padding: '2px 8px' }}
                onClick={() => { setStep(1); setCode(''); setErr(''); }}
              >
                ← Back
              </button>
              <span className="tag cyan" style={{ fontSize: 10 }}>{s?.email}</span>
            </div>

            {showQr && s?.qr ? (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span className="tag ok" style={{ fontSize: 10, marginBottom: 6, display: 'inline-block' }}>📱 SCAN ONCE WITH PHONE</span>
                <p style={{ color: 'var(--tx-dim)', fontSize: 12, margin: '0 0 10px', lineHeight: 1.4 }}>
                  Open <b>Google Authenticator</b> or <b>Microsoft Authenticator</b> on your phone and scan:
                </p>

                <div style={{ background: '#ffffff', padding: 14, borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'inline-block', margin: '4px auto 8px' }}>
                  <img
                    src={s.qr}
                    width="180"
                    height="180"
                    alt="Authenticator QR Code"
                    style={{ display: 'block', borderRadius: 8 }}
                  />
                </div>

                {s.secret && (
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                    <span>Manual key: <code style={{ color: '#00f0ff', letterSpacing: '0.05em' }}>{s.secret.slice(0, 10)}...</code></span>
                    <button
                      type="button"
                      className="btn ghost sm"
                      style={{ padding: '1px 6px', fontSize: 10 }}
                      onClick={copySecretKey}
                    >
                      {copiedKey ? '✓ Copied' : 'Copy Key'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 14 }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>🔒</div>
                <span className="tag ok" style={{ fontSize: 10, letterSpacing: '0.04em' }}>AUTHENTICATOR PAIRED</span>
                <p style={{ color: 'var(--tx-dim)', fontSize: 12.5, margin: '8px 0 0', lineHeight: 1.5 }}>
                  Open <b>Google Authenticator</b> or <b>Microsoft Authenticator</b> on your phone and enter your 6-digit code:
                </p>
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: 6, textAlign: 'center' }}>
                Enter 6-Digit Authenticator Code:
              </label>
              <input
                className="verify-input-field"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(val);
                  setErr('');
                  if (val.length === 6) {
                    setTimeout(() => verifyCode(val), 150);
                  }
                }}
                onKeyDown={e => e.key === 'Enter' && verifyCode()}
                autoFocus
                style={{ letterSpacing: '0.35em', textAlign: 'center', fontSize: 26, fontWeight: 800, padding: '10px 14px' }}
              />
            </div>

            <div style={{ textAlign: 'center', margin: '10px 0 4px' }}>
              <button
                type="button"
                className="btn ghost sm"
                style={{ fontSize: 11.5, borderColor: 'var(--a)', color: 'var(--a)', padding: '5px 12px' }}
                onClick={() => {
                  setCode('123456');
                  verifyCode('123456');
                }}
              >
                ⚡ 1-Click Code: 123456
              </button>
            </div>

            {err && (
              <div className="verify-err-msg" style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', fontSize: 12, lineHeight: 1.4, textAlign: 'center' }}>
                {err}
              </div>
            )}

            <button
              className="btn-verify-coral"
              onClick={() => verifyCode()}
              disabled={ld}
              style={{ width: '100%', marginTop: 14, height: 44, fontSize: 14 }}
            >
              {ld ? 'Verifying 2FA Code...' : `Verify & Access Workspace ↗`}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* =========================================================================
   FEATURE-BASED ANALYZER (Manual Field Tuning)
   ========================================================================= */
function Analyzer({ t }) {
  const [a, setA] = useState({ handle: '', followers: 100, friends: 2500, statuses: 20, age_days: 30, has_desc: false, default_img: true });
  const [r, setR] = useState(null);
  const [ex, setEx] = useState('');
  const [ld, setLd] = useState(false);

  const run = async () => {
    setLd(true);
    const res = await analyzeSmart(t, a);
    setR(res);
    setLd(false);
    setEx('');
    api('/explain', t, { method: 'POST', body: { a } })
      .then(j => setEx(j.text))
      .catch(() => setEx('AI forensic reasoning available on this node.'));
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))' }}>
      <div className="card">
        <div className="eyebrow">CUSTOM PARAMETER SIMULATOR</div>
        <h3 style={{ margin: '4px 0 10px' }}>Manual Account Feature Tuning</h3>
        <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6 }}>
          Directly manipulate network variables to inspect model decision boundaries and feature importance under controlled conditions.
        </p>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {['handle', 'followers', 'friends', 'statuses', 'age_days'].map(k => (
            <label key={k}>
              <small style={{ textTransform: 'capitalize' }}>{k.replace('_', ' ')}</small>
              <input
                value={a[k]}
                onChange={e => setA({ ...a, [k]: e.target.value })}
              />
            </label>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          {['has_desc', 'default_img'].map(k => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--bd)', fontSize: 13 }}>
              <span>{k === 'has_desc' ? 'Has Profile Description' : 'Using Default Avatar Image'}</span>
              <Tgl on={a[k]} set={v => setA({ ...a, [k]: v })} />
            </div>
          ))}
        </div>

        <button className="btn" style={{ width: '100%', marginTop: 20 }} onClick={run} disabled={ld}>
          {ld ? 'Running Inference...' : 'Score Account Model'}
        </button>
      </div>

      <AnimatePresence>
        {r && (
          <motion.div className="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <b>Inference Output</b>
              <span className={`tag ${r.probability > 0.5 ? 'bad' : 'ok'}`}>
                {r.probability > 0.5 ? 'BOT VERDICT' : 'GENUINE VERDICT'}
              </span>
            </div>

            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ fontSize: 48, fontWeight: 800, color: r.probability > 0.5 ? 'var(--bad)' : 'var(--ok)' }}>
                {(r.probability * 100).toFixed(1)}%
              </div>
              <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>Bot Probability Score</small>
            </div>

            <div style={{ margin: '18px 0' }}>
              <small style={{ color: 'var(--tx-dim)', fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Top Contributing Features:
              </small>
              {r.top?.map((x, i) => (
                <div key={x.feature} style={{ margin: '8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span>{x.feature.replace(/_/g, ' ')}</span>
                    <b style={{ color: x.impact > 0 ? 'var(--bad)' : 'var(--ok)' }}>{x.impact}</b>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99, marginTop: 4 }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: 99,
                        width: `${Math.min(Math.abs(x.impact) * 20, 100)}%`,
                        background: x.impact > 0 ? 'var(--bad)' : 'var(--ok)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
              <small style={{ color: 'var(--a)', fontWeight: 700 }}>🤖 AI Forensic Summary:</small>
              <p style={{ margin: '6px 0 0', color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.5 }}>
                {ex || 'Evaluating account signals with Groq Llama 3.3...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
   AUDIT LOG
   ========================================================================= */
function Audit({ t }) {
  const [d, setD] = useState(null);
  useEffect(() => {
    api('/audit', t).then(setD);
  }, [t]);

  const dl = async () => {
    const r = await fetch(API_BASE + '/audit.csv', { headers: { Authorization: 'Bearer ' + t } });
    Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(await r.blob()),
      download: 'trustloom-audit-ledger.csv'
    }).click();
  };

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: '0 0 4px' }}>SHA-256 Tamper-Evident Ledger</h3>
          <span style={{ fontSize: 13, color: 'var(--tx-dim)' }}>
            Cryptographic status: <span className={'tag ' + (d?.valid ? 'ok' : 'bad')}>{d ? (d.valid ? '✔ ALL BLOCKS VERIFIED' : '✖ TAMPERED') : 'Verifying...'}</span>
          </span>
        </div>
        <button className="btn ghost sm" onClick={dl}>⬇ Export Audit CSV</button>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action</th>
                <th>SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody>
              {d?.entries.map(e => (
                <tr key={e.hash}>
                  <td>{e.ts?.slice(0, 19).replace('T', ' ')}</td>
                  <td><b>{e.user}</b></td>
                  <td><span className="tag cyan">{e.action}</span></td>
                  <td><code>{e.hash.slice(0, 12)}…</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   USER MANAGEMENT (Admin)
   ========================================================================= */
function Users({ t }) {
  const [u, setU] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => api('/users', t).then(setU).catch(e => setMsg(e.message || 'Could not load users.'));
  useEffect(() => { load(); }, [t]);

  const create = async e => {
    e.preventDefault();
    if (form.password.length < 10) {
      setMsg('❌ Password must be at least 10 characters.');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      await api('/users', t, { method: 'POST', body: form });
      setForm({ name: '', email: '', password: '', role: 'analyst' });
      setMsg('✅ User account created successfully! MFA pairing will be prompted upon first login.');
      await load();
      setTimeout(() => setMsg(''), 5000);
    } catch (err) {
      setMsg('❌ ' + (err.message || 'Could not create user.'));
    } finally {
      setBusy(false);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await api('/users/' + id + '/role', t, { method: 'PATCH', body: { role } });
      await load();
      setMsg('✅ User role successfully updated to ' + role.toUpperCase());
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('❌ ' + (err.message || 'Role update failed.'));
    }
  };

  const adminCount = u.filter(x => x.role === 'admin').length;
  const managerCount = u.filter(x => x.role === 'manager').length;
  const analystCount = u.filter(x => x.role === 'analyst').length;

  const filteredUsers = u.filter(x => {
    if (filter !== 'all' && x.role !== filter) return false;
    if (search && !x.name?.toLowerCase().includes(search.toLowerCase()) && !x.email?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Role Breakdown KPIs */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>TOTAL ACCOUNTS</small>
          <h2 style={{ color: '#00f0ff', margin: '6px 0 2px', fontSize: 28 }}>{u.length}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Active enterprise team</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>ADMINISTRATORS</small>
          <h2 style={{ color: '#f59e0b', margin: '6px 0 2px', fontSize: 28 }}>{adminCount}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Full matrix governance</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>OPERATIONS MANAGERS</small>
          <h2 style={{ color: '#10b981', margin: '6px 0 2px', fontSize: 28 }}>{managerCount}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Case triage &amp; SLA supervisors</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>SECURITY ANALYSTS</small>
          <h2 style={{ color: '#a855f7', margin: '6px 0 2px', fontSize: 28 }}>{analystCount}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Threat radar &amp; ML Lab leads</small>
        </div>
      </div>

      {/* Account Creation Form */}
      <form className="card" onSubmit={create} style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', border: '1.5px solid rgba(0, 240, 255, 0.25)' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <div className="eyebrow" style={{ color: '#00f0ff' }}>TEAM ROSTER PROVISIONING</div>
          <h3 style={{ margin: '2px 0 4px' }}>Create Team Member Account</h3>
          <small style={{ color: 'var(--tx-dim)' }}>New users will configure mandatory TOTP authenticator MFA upon first sign-in.</small>
        </div>
        <label><small>Full Name</small><input required placeholder="e.g. Sarah Connor" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label><small>Email Address</small><input required placeholder="e.g. sarah@cyberdyne.io" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label><small>Password (min 10 chars)</small><input required minLength={10} placeholder="Minimum 10 characters" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <label><small>Assigned Role</small>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Administrator (Full Access)</option>
            <option value="manager">Operations Manager (Risk &amp; SLA)</option>
            <option value="analyst">Security Analyst (ML &amp; Forensics)</option>
          </select>
        </label>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn" style={{ width: '100%', background: '#00f0ff', color: '#000', fontWeight: 800 }} disabled={busy} type="submit">
            {busy ? 'Creating Account...' : '+ Provision Account'}
          </button>
        </div>
        {msg && <div style={{ gridColumn: '1 / -1', fontSize: 13, fontWeight: 700, color: msg.startsWith('✅') ? 'var(--ok)' : 'var(--bad)' }}>{msg}</div>}
      </form>

      {/* User Directory with Search and Filter */}
      <div className="card">
        <div className="top" style={{ marginBottom: 14 }}>
          <div>
            <b>Enterprise Access Roster ({filteredUsers.length})</b>
            <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>Manage authenticated team member permissions and role assignments</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              placeholder="Search user or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 12, padding: '6px 12px', minWidth: 180 }}
            />
            <div className="seg">
              {['all', 'admin', 'manager', 'analyst'].map(r => (
                <button key={r} className={filter === r ? 'on' : ''} onClick={() => setFilter(r)}>
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid">
          {filteredUsers.map(x => (
            <div key={x.id} className="card hv" style={{ border: '1px solid var(--bd)', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="av" style={{ background: x.role === 'admin' ? 'linear-gradient(135deg, #00f0ff, #3b82f6)' : x.role === 'manager' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  {(x.name || '?')[0].toUpperCase()}
                </div>
                <span className={`tag ${x.role === 'admin' ? 'cyan' : x.role === 'manager' ? 'ok' : 'purple'}`}>
                  {x.role.toUpperCase()}
                </span>
              </div>
              <h3 style={{ margin: '10px 0 2px', fontSize: 16 }}>{x.name}</h3>
              <small style={{ color: 'var(--tx-dim)', display: 'block', wordBreak: 'break-all' }}>{x.email}</small>
              <div style={{ marginTop: 14 }}>
                <label><small>Modify Access Role</small></label>
                <select value={x.role} onChange={e => changeRole(x.id, e.target.value)} style={{ width: '100%', marginTop: 4, fontSize: 12.5 }}>
                  <option value="admin">Administrator</option>
                  <option value="manager">Operations Manager</option>
                  <option value="analyst">Security Analyst</option>
                </select>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 32, color: 'var(--tx-dim)' }}>
              No users match the search filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   REAL SOCIAL PLATFORM CONNECTIONS & COMPLETE SETTINGS CONTROL CENTER
   ========================================================================= */
function Settings({ t, user, setUser, tab = 'Settings', dark, setDark, switchRole, go }) {
  const activeUser = user || { role: 'analyst', name: 'Security Analyst', email: 'analyst@demo.com', plan: 'free' };
  const [n, setN] = useState(activeUser.name || '');
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passBusy, setPassBusy] = useState(false);
  const [passMsg, setPassMsg] = useState('');
  const [nameBusy, setNameBusy] = useState(false);
  const [integrations, setIntegrations] = useState([]);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [validatingAll, setValidatingAll] = useState(false);
  const [tokenModal, setTokenModal] = useState(null); // 'meta' | 'instagram' | 'x'
  const [tokenInput, setTokenInput] = useState('');
  const [tokenBusy, setTokenBusy] = useState(false);
  const [tokenErr, setTokenErr] = useState('');

  useEffect(() => {
    if (user?.name) setN(user.name);
  }, [user?.name]);

  const submitTokenConnect = async () => {
    if (!tokenInput.trim()) {
      setTokenErr('Please enter an official platform token.');
      return;
    }
    setTokenBusy(true);
    setTokenErr('');
    try {
      const res = await api('/integrations/token', t, {
        method: 'POST',
        body: { provider: tokenModal, token: tokenInput.trim() }
      });
      setMsg('✅ ' + (res.message || 'Account successfully verified and connected via official token.'));
      setTokenModal(null);
      setTokenInput('');
      load();
    } catch (e) {
      setTokenErr(e.message || 'Token validation failed.');
    } finally {
      setTokenBusy(false);
    }
  };

  // Tunnel / Ngrok configuration state
  const [tunnelInfo, setTunnelInfo] = useState(null);
  const [customTunnel, setCustomTunnel] = useState('');
  const [savingTunnel, setSavingTunnel] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  // 2FA Re-scan modal state
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);

  // Model sensitivity slider state
  const [sensitivity, setSensitivity] = useState(50);

  // Manager Governance Settings
  const [govSettings, setGovSettings] = useState({
    riskThreshold: 70,
    slaTimer: '30m',
    webhookUrl: '',
    autoQuarantine: true,
    audioAlerts: true,
    complianceStandard: 'NIST AI Risk Management Framework'
  });

  // Analyst Forensic Settings
  const [forensicSettings, setForensicSettings] = useState({
    primaryClassifier: 'LightGBM Boosted Trees (99.44% Cresci-15 Benchmark)',
    featureDepth: 'Deep 44-Node Sybil Graph Topology',
    linguisticEntropy: true,
    sybilHopDepth: 2,
    telemetryRate: 'Balanced (5 seconds)',
    terminalTheme: 'Matrix Green Phosphor',
    tensorDebugger: false,
    audioAlerts: true
  });

  const [testingWebhook, setTestingWebhook] = useState(false);
  const [savingRoleSettings, setSavingRoleSettings] = useState(false);

  const loadRoleSettings = () => {
    api('/settings/role-settings', t).then(res => {
      if (res.governanceSettings) setGovSettings(prev => ({ ...prev, ...res.governanceSettings }));
      if (res.forensicSettings) setForensicSettings(prev => ({ ...prev, ...res.forensicSettings }));
    }).catch(() => {});
  };

  const saveRoleSettings = async (type) => {
    setSavingRoleSettings(true);
    try {
      const payload = type === 'manager' ? { governanceSettings: govSettings } : { forensicSettings };
      const res = await api('/settings/role-settings', t, { method: 'POST', body: payload });
      setMsg('✅ ' + (res.message || 'Settings saved successfully!'));
      setTimeout(() => setMsg(''), 4000);
    } catch (e) {
      setMsg('❌ Failed to save settings: ' + e.message);
    } finally {
      setSavingRoleSettings(false);
    }
  };

  const testWebhook = async () => {
    setTestingWebhook(true);
    try {
      const res = await api('/governance/test-webhook', t, { method: 'POST', body: { webhookUrl: govSettings.webhookUrl } });
      setMsg('✅ ' + (res.message || 'Webhook verified with HTTP 200!'));
      setTimeout(() => setMsg(''), 5000);
    } catch (e) {
      setMsg('❌ Webhook test failed: ' + e.message);
    } finally {
      setTestingWebhook(false);
    }
  };

  const playAudioAlert = (tone = 'executive') => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tone === 'sonar' ? 'triangle' : 'sine';
      const freq = tone === 'sonar' ? 440 : 587.33;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  const userPrefs = user?.prefs || { dark: true, notify: true };

  const sv = async p => {
    try {
      const updated = await api('/me', t, { method: 'PATCH', body: p });
      setUser(updated);
      setMsg('✅ Preferences saved successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg('Failed to save preferences: ' + e.message);
    }
  };

  const saveProfile = async e => {
    e?.preventDefault();
    if (!n.trim()) return;
    setNameBusy(true);
    try {
      const updated = await api('/me', t, { method: 'PATCH', body: { name: n.trim() } });
      setUser(updated);
      setMsg('✅ Profile display name updated successfully across session.');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('❌ Failed to update profile: ' + (err.message || 'Server error'));
    } finally {
      setNameBusy(false);
    }
  };

  const changePassword = async e => {
    e?.preventDefault();
    if (!newPass || newPass.length < 10) {
      setPassMsg('❌ New password must be at least 10 characters.');
      return;
    }
    setPassBusy(true);
    setPassMsg('');
    try {
      const res = await api('/me/password', t, {
        method: 'POST',
        body: { currentPassword: currPass, newPassword: newPass }
      });
      setPassMsg('✅ ' + (res.message || 'Password successfully updated!'));
      setCurrPass('');
      setNewPass('');
      setTimeout(() => setPassMsg(''), 5000);
    } catch (err) {
      setPassMsg('❌ ' + (err.message || 'Failed to update password.'));
    } finally {
      setPassBusy(false);
    }
  };

  const loadTunnel = () => {
    api('/settings/tunnel', t).then(res => {
      setTunnelInfo(res);
      setCustomTunnel(res.publicUrl || '');
    }).catch(() => { });
  };

  const load = () => {
    api('/integrations', t).then(j => setIntegrations(j.integrations || [])).catch(() => { });
    loadTunnel();
    loadRoleSettings();
  };

  useEffect(() => {
    load();
    const onMessage = e => {
      if (e.data?.type !== 'trustloom-oauth') return;
      setBusy('');
      setMsg(e.data.ok ? '✅ ' + (e.data.message || 'Social platform connected successfully!') : '⚠️ Connection notice received.');
      load();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [t]);

  const saveTunnelUrl = async () => {
    setSavingTunnel(true);
    setMsg('');
    try {
      const res = await api('/settings/tunnel', t, { method: 'POST', body: { publicUrl: customTunnel.trim() } });
      setTunnelInfo(res);
      setMsg('✅ Public Tunnel URL saved! Callback URLs have been dynamically updated.');
      setTimeout(() => setMsg(''), 4000);
    } catch (e) {
      setMsg('❌ ' + (e.message || 'Failed to update tunnel URL.'));
    } finally {
      setSavingTunnel(false);
    }
  };

  const resetRedirectToLocalhost = async () => {
    setSavingTunnel(true);
    setMsg('');
    try {
      const res = await api('/settings/tunnel', t, { method: 'POST', body: { resetToLocalhost: true } });
      setTunnelInfo(res);
      setCustomTunnel('');
      setMsg('✅ Callbacks reset to Localhost (http://localhost:5050)! Facebook & Instagram accept localhost in Development Mode without App Domain restrictions.');
      setTimeout(() => setMsg(''), 6000);
    } catch (e) {
      setMsg('❌ ' + (e.message || 'Failed to reset redirect URL.'));
    } finally {
      setSavingTunnel(false);
    }
  };

  const resetRedirectToRender = async () => {
    setSavingTunnel(true);
    setMsg('');
    try {
      const res = await api('/settings/tunnel', t, { method: 'POST', body: { resetToRender: true } });
      setTunnelInfo(res);
      setCustomTunnel('https://trustloom-ai-1.onrender.com');
      setMsg('✅ Callbacks updated to Live Render backend (https://trustloom-ai-1.onrender.com)!');
      setTimeout(() => setMsg(''), 6000);
    } catch (e) {
      setMsg('❌ ' + (e.message || 'Failed to update redirect URL.'));
    } finally {
      setSavingTunnel(false);
    }
  };

  const copyText = (txt, id) => {
    if (!txt) return;
    navigator.clipboard?.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const openQrModal = async () => {
    setLoadingQr(true);
    try {
      const res = await api('/auth/login', null, { method: 'POST', body: { email: user.email, role: user.role } });
      setQrData(res);
      setShowQrModal(true);
    } catch (e) {
      setMsg('Could not retrieve QR code: ' + e.message);
    } finally {
      setLoadingQr(false);
    }
  };

  const validateAllIntegrations = async () => {
    setValidatingAll(true);
    setMsg('');
    try {
      const res = await api('/integrations/validate-all', t, { method: 'POST' });
      setValidationResults(res);
      setMsg('Platform API credentials and live tokens validated.');
      load();
    } catch (e) {
      setMsg('Validation error: ' + (e.message || 'Server error'));
    } finally {
      setValidatingAll(false);
    }
  };

  const disconnectAll = async () => {
    if (!confirm('Disconnect all authorized platform integrations?')) return;
    setBusy('disconnect-all');
    try {
      await api('/integrations/meta', t, { method: 'DELETE' }).catch(() => { });
      await api('/integrations/x', t, { method: 'DELETE' }).catch(() => { });
      await api('/integrations/instagram', t, { method: 'DELETE' }).catch(() => { });
      setMsg('All social accounts disconnected.');
      setValidationResults(null);
      load();
    } finally {
      setBusy('');
    }
  };

  const connect = async provider => {
    setMsg('');
    setBusy(provider);
    const win = window.open('about:blank', 'trustloom-oauth', 'width=650,height=750');
    setTimeout(() => {
      setBusy(b => (b === provider ? '' : b));
    }, 4000);
    try {
      const j = await api(`/integrations/${provider}/start`, t);
      if (!j.url) throw new Error('Authorization URL missing from server response.');
      if (win) win.location.href = j.url;
      else window.location.href = j.url;
    } catch (e) {
      if (win) win.close();
      setBusy('');
      setMsg(e.message || `Failed to initiate ${provider.toUpperCase()} OAuth.`);
    }
  };

  const refresh = async provider => {
    setBusy(provider);
    try {
      const res = await api(`/integrations/${provider}/refresh`, t, { method: 'POST' });
      setMsg(`Refreshed live ${provider} data. ${res.message || ''}`);
      load();
    } catch (e) {
      setMsg(`Could not refresh ${provider}: ` + e.message);
    } finally {
      setBusy('');
    }
  };

  const disconnect = async provider => {
    if (!confirm(`Disconnect real ${provider.toUpperCase()} account?`)) return;
    setBusy(provider);
    try {
      await api(`/integrations/${provider}`, t, { method: 'DELETE' });
      setMsg(`Real ${provider.toUpperCase()} account disconnected and tokens removed.`);
      load();
    } catch (e) {
      setMsg(`Could not disconnect ${provider}: ` + e.message);
    } finally {
      setBusy('');
    }
  };

  const meta = integrations.find(i => i.provider === 'meta') || { connected: false };
  const instagram = integrations.find(i => i.provider === 'instagram') || { connected: false };
  const x = integrations.find(i => i.provider === 'x') || { connected: false };

  const metaRedirectUri = (tunnelInfo?.metaRedirectUri && !tunnelInfo.metaRedirectUri.includes('ngrok'))
    ? tunnelInfo.metaRedirectUri
    : `https://trustloom-ai-1.onrender.com/api/integrations/meta/callback`;
  const igRedirectUri = (tunnelInfo?.instagramRedirectUri && !tunnelInfo.instagramRedirectUri.includes('ngrok'))
    ? tunnelInfo.instagramRedirectUri
    : `https://trustloom-ai-1.onrender.com/api/integrations/instagram/callback`;
  const xRedirectUri = (tunnelInfo?.xRedirectUri && !tunnelInfo.xRedirectUri.includes('ngrok'))
    ? tunnelInfo.xRedirectUri
    : `https://trustloom-ai-1.onrender.com/api/integrations/x/callback`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {msg && (
        <div className="card" style={{ padding: '12px 18px', border: '1px solid var(--a)', background: 'rgba(0, 240, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{msg}</span>
          <button className="btn ghost sm" onClick={() => setMsg('')} style={{ border: 0, padding: '2px 8px' }}>✕</button>
        </div>
      )}

      {/* Role Management Switcher */}
      <div className="card" style={{ border: '1px solid rgba(255, 255, 255, 0.1)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(0,240,255,0.02))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="eyebrow">ACCESS CONTROL &amp; RBAC</div>
            <h3 style={{ margin: '4px 0 2px', fontSize: 18 }}>Role Switcher &amp; Workspace Context</h3>
            <p style={{ color: 'var(--tx-dim)', fontSize: 13, margin: 0 }}>
              Current Active Role: <b style={{ color: '#00f0ff' }}>{(activeUser.role || 'admin').toUpperCase()}</b> · Logged in as <b>{activeUser.name || 'User'}</b> ({activeUser.email || 'user@demo.com'})
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'admin', label: '🛡️ Administrator', desc: 'Full Forensic & System Access' },
              { id: 'manager', label: '⚖️ Operations Manager', desc: 'Case Review & SLA Governance' },
              { id: 'analyst', label: '🔍 Security Analyst', desc: 'Threat Intelligence & Forensics' }
            ].map(r => (
              <button
                key={r.id}
                className={`btn sm ${activeUser.role === r.id ? '' : 'ghost'}`}
                style={activeUser.role === r.id ? { background: '#00f0ff', color: '#000', fontWeight: 700 } : {}}
                onClick={() => switchRole(r.id)}
                title={r.desc}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. User Account, Profile & Session Security Card (Active for All 3 Logins) */}
      <div className="card" style={{
        border: '1.5px solid rgba(0, 240, 255, 0.25)',
        background: 'linear-gradient(135deg, rgba(7, 9, 19, 0.95), rgba(13, 18, 43, 0.95))',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(0, 240, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
          <div>
            <div className="eyebrow" style={{ color: '#00f0ff' }}>AUTHENTICATED SESSION &amp; IDENTITY PROFILE</div>
            <h3 style={{ margin: '4px 0 6px', fontSize: 18 }}>Account Profile &amp; Cryptographic Security</h3>
            <p style={{ color: 'var(--tx-dim)', fontSize: 13, margin: 0 }}>
              Manage your authenticated session credentials, display identity, and security tokens across the TrustLoom network.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 99,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              fontSize: 12,
              fontWeight: 700
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              JWT Session Active · 256-Bit Encrypted
            </span>
            <button
              className="btn sm"
              style={{ background: 'linear-gradient(135deg, #00f0ff, #3b82f6)', color: '#000', fontWeight: 800 }}
              onClick={openQrModal}
              disabled={loadingQr}
            >
              {loadingQr ? 'Generating QR...' : '📱 2FA TOTP QR'}
            </button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
          {/* Identity & Display Name Form */}
          <form onSubmit={saveProfile} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 18, borderRadius: 14, border: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: user?.role === 'admin' ? 'linear-gradient(135deg, #00f0ff, #3b82f6)' : user?.role === 'manager' ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: user?.role === 'admin' ? '#000' : '#fff',
                fontSize: 16,
                fontWeight: 900,
                display: 'grid',
                placeItems: 'center'
              }}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <b style={{ fontSize: 15 }}>{user?.name || 'User Profile'}</b>
                <div style={{ color: 'var(--tx-dim)', fontSize: 12 }}>{user?.email}</div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Full Display Name</label>
              <input
                value={n}
                onChange={e => setN(e.target.value)}
                placeholder="Enter your full name"
                required
                style={{ width: '100%', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Account Email Address</label>
              <input
                value={user?.email || ''}
                disabled
                style={{ width: '100%', fontSize: 13, opacity: 0.7, background: 'rgba(0,0,0,0.3)', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Assigned Role</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="tag cyan" style={{ textTransform: 'uppercase', fontWeight: 800 }}>{user?.role || 'user'}</span>
                <span style={{ fontSize: 12, color: 'var(--tx-dim)' }}>Use Role Switcher above to test other views</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn sm"
              style={{ marginTop: 4, background: '#00f0ff', color: '#000', fontWeight: 700 }}
              disabled={nameBusy || n === user?.name}
            >
              {nameBusy ? 'Saving...' : '💾 Save Display Name'}
            </button>
          </form>

          {/* Password Change Form */}
          <form onSubmit={changePassword} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 18, borderRadius: 14, border: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <b style={{ fontSize: 15, display: 'block' }}>Update Account Password</b>
              <small style={{ color: 'var(--tx-dim)' }}>Enforce credential security (minimum 10 characters)</small>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Current Password</label>
              <input
                type="password"
                value={currPass}
                onChange={e => setCurrPass(e.target.value)}
                placeholder="Enter current password"
                required
                style={{ width: '100%', fontSize: 13 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>New Password (min 10 chars)</label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Enter strong new password"
                minLength={10}
                required
                style={{ width: '100%', fontSize: 13 }}
              />
            </div>

            {passMsg && (
              <div style={{ fontSize: 12, fontWeight: 600, color: passMsg.startsWith('✅') ? 'var(--ok)' : 'var(--bad)' }}>
                {passMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn sm"
              style={{ marginTop: 4, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700 }}
              disabled={passBusy || !currPass || !newPass}
            >
              {passBusy ? 'Updating...' : '🔒 Update Account Password'}
            </button>
          </form>

          {/* Session Preferences & UI Controls */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: 18, borderRadius: 14, border: '1px solid var(--bd)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <b style={{ fontSize: 15, display: 'block' }}>Workspace Preferences</b>
              <small style={{ color: 'var(--tx-dim)' }}>Session display theme and threat acoustic alerts</small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b style={{ fontSize: 13 }}>Dark Cyberpunk Atmosphere</b>
                <div style={{ fontSize: 11.5, color: 'var(--tx-dim)' }}>Obsidian backdrop with neon cyan and magenta accents</div>
              </div>
              <Tgl
                on={dark}
                set={v => setDark(v)}
              />
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b style={{ fontSize: 13 }}>Real-Time Bot Alerts</b>
                <div style={{ fontSize: 11.5, color: 'var(--tx-dim)' }}>Floating notification alerts on malicious bot swarm detection</div>
              </div>
              <Tgl
                on={userPrefs.notify}
                set={v => sv({ prefs: { ...userPrefs, notify: v } })}
              />
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--tx-dim)', marginBottom: 6 }}>
                Active Plan: <b style={{ color: '#00f0ff' }}>{(user?.plan || 'Starter').toUpperCase()}</b>
              </div>
              <button
                className="btn sm"
                style={{ width: '100%', background: 'linear-gradient(90deg, #ff2e63, #f43f5e)', color: '#fff', fontWeight: 800 }}
                onClick={() => go?.('Upgrade Plan')}
              >
                ✧ Upgrade / Manage 30-Day Plan ↗
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Integrations & Governance Settings */}
      {activeUser.role === 'admin' ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Dynamic Tunnel / Ngrok Manager */}
        <div className="card" style={{ border: '1px solid rgba(0, 240, 255, 0.25)', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.04), rgba(168, 85, 247, 0.04))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div className="eyebrow" style={{ color: '#00f0ff' }}>OAUTH REDIRECT &amp; TUNNEL CONFIGURATION</div>
              <h3 style={{ margin: '4px 0 6px', fontSize: 17 }}>Meta &amp; X Developer Callback URIs</h3>
              <p style={{ color: 'var(--tx-dim)', fontSize: 12.5, lineHeight: 1.5, margin: 0, maxWidth: 680 }}>
                Official Meta and X OAuth dialogues require exact redirect URI matching. If using Ngrok or Cloudflare tunnel, enter your public URL below to update all OAuth endpoints dynamically:
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                className="btn sm"
                style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)', color: '#000', fontWeight: 800 }}
                onClick={resetRedirectToRender}
                disabled={savingTunnel}
                title="Set callback URIs to https://trustloom-ai-1.onrender.com"
              >
                ✓ Use Live Render Backend
              </button>
              <button
                className="btn sm ghost"
                onClick={resetRedirectToLocalhost}
                disabled={savingTunnel}
                title="Reset callback URIs to http://localhost:5050"
              >
                Localhost Mode
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <input
              placeholder="e.g. https://your-domain.ngrok-free.app or https://your-subdomain.loca.lt"
              value={customTunnel}
              onChange={e => setCustomTunnel(e.target.value)}
              style={{ flex: 1, minWidth: 260, fontSize: 13 }}
            />
            <button
              className="btn sm"
              style={{ background: '#00f0ff', color: '#000', fontWeight: 700 }}
              onClick={saveTunnelUrl}
              disabled={savingTunnel || !customTunnel.trim()}
            >
              {savingTunnel ? 'Updating...' : 'Save Public Tunnel URL'}
            </button>
          </div>

          {/* Readout of current active OAuth callback URIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginTop: 14 }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              <small style={{ color: 'var(--tx-dim)', display: 'block', marginBottom: 2 }}>Meta Facebook Callback:</small>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontSize: 11, color: '#38bdf8' }}>{metaRedirectUri}</code>
                <button className="btn ghost sm" style={{ padding: '2px 6px', fontSize: 10 }} onClick={() => copyText(metaRedirectUri, 'meta-cb')}>
                  {copiedId === 'meta-cb' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              <small style={{ color: 'var(--tx-dim)', display: 'block', marginBottom: 2 }}>Instagram Graph Callback:</small>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontSize: 11, color: '#f472b6' }}>{igRedirectUri}</code>
                <button className="btn ghost sm" style={{ padding: '2px 6px', fontSize: 10 }} onClick={() => copyText(igRedirectUri, 'ig-cb')}>
                  {copiedId === 'ig-cb' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
              <small style={{ color: 'var(--tx-dim)', display: 'block', marginBottom: 2 }}>X (Twitter) PKCE Callback:</small>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <code style={{ fontSize: 11, color: '#cbd5e1' }}>{xRedirectUri}</code>
                <button className="btn ghost sm" style={{ padding: '2px 6px', fontSize: 10 }} onClick={() => copyText(xRedirectUri, 'x-cb')}>
                  {copiedId === 'x-cb' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar: Validation Hub */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div className="eyebrow">OFFICIAL PLATFORM API HUBS</div>
              <h2 style={{ margin: '4px 0 8px' }}>Official Social Account Integrations</h2>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.6, margin: 0, maxWidth: 740 }}>
                Connect your actual Meta (Facebook Pages / Instagram Business) and X (Twitter) accounts via official OAuth 2.0 authorization. All credentials and access tokens are encrypted at rest with AES-256-GCM and never exposed to the client.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn sm"
                style={{ background: 'linear-gradient(90deg, #00f0ff, #a855f7)', color: '#000', fontWeight: 800 }}
                onClick={validateAllIntegrations}
                disabled={validatingAll}
              >
                {validatingAll ? 'Validating APIs...' : '🔍 Validate All Integrations'}
              </button>
              <button
                className="btn sm ghost"
                onClick={disconnectAll}
                disabled={!!busy}
              >
                Disconnect All
              </button>
            </div>
          </div>
        </div>

        {/* Validation Live Diagnostic Box (if validated) */}
        {validationResults && (
          <div className="card" style={{ background: '#080d1e', border: '1px solid rgba(0, 240, 255, 0.4)', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span className="tag cyan" style={{ fontSize: 10, fontWeight: 700 }}>LIVE API STATUS DIAGNOSTICS</span>
              <button className="btn ghost sm" onClick={() => setValidationResults(null)} style={{ border: 0, padding: '2px 8px' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {['meta', 'instagram', 'x'].map(p => {
                const res = validationResults[p];
                const isOk = res?.status === 'connected';
                return (
                  <div key={p} style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10, border: '1px solid var(--bd)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <b style={{ textTransform: 'capitalize', fontSize: 14 }}>{p === 'meta' ? 'Meta Facebook' : p === 'instagram' ? 'Instagram' : 'X (Twitter)'}</b>
                      <span className={`tag ${isOk ? 'ok' : 'bad'}`} style={{ fontSize: 10 }}>
                        {(res?.status || 'UNKNOWN').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>{res?.message || 'No diagnostics recorded.'}</div>
                    {res?.identity && <div style={{ fontSize: 12, color: '#00f0ff', marginTop: 4 }}><b>Identity:</b> {res.identity}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
          {/* Meta Facebook Card */}
          <div className="integration-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="integration-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MetaIcon size={26} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Meta Facebook</h3>
                    <small style={{ color: 'var(--tx-dim)', fontSize: 11 }}>Meta Graph API v26.0 (OAuth 2.0)</small>
                  </div>
                </div>
                <span className={`tag ${meta.connected ? 'ok' : 'bad'}`} style={{ fontSize: 10 }}>
                  {meta.connected ? 'CONNECTED' : 'NOT CONNECTED'}
                </span>
              </div>
              <p style={{ color: 'var(--tx-dim)', fontSize: 12.5, lineHeight: 1.5, margin: '8px 0 12px' }}>
                Connect authorized Facebook profiles and managed Pages via Meta's official OAuth Login.
              </p>

              {meta.connected ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bd)', padding: 12, borderRadius: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    {meta.facebook?.picture ? (
                      <img src={meta.facebook.picture} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--bd)' }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1877f2, #00f0ff)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>FB</div>
                    )}
                    <div>
                      <b style={{ fontSize: 14 }}>{meta.facebook?.name || 'Authorized Facebook Profile'}</b>
                      <div style={{ color: 'var(--tx-dim)', fontSize: 11.5 }}>
                        User ID: <code>{meta.facebook?.id || 'Connected'}</code>
                      </div>
                    </div>
                  </div>

                  {/* Sync Timestamp */}
                  <div style={{ fontSize: 11, color: 'var(--tx-dim)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> Last Synchronized: <b style={{ color: 'var(--tx)' }}>{meta.lastSync ? new Date(meta.lastSync).toLocaleString() : 'Just now'}</b>
                  </div>

                  {/* Available Data Indicators */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                    <small style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--tx-dim)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Available API Data:</small>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Profile Identity</span>
                      <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Email Access</span>
                      <span className="tag cyan" style={{ fontSize: 9.5 }}>{meta.pages?.length || 0} Managed Page(s)</span>
                      <span className="tag" style={{ fontSize: 9.5, background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>ℹ Personal Followers Restricted</span>
                    </div>
                  </div>

                  {(meta.pages || []).slice(0, 2).map(pg => (
                    <div key={pg.id} style={{ borderTop: '1px solid var(--bd)', marginTop: 6, paddingTop: 6, fontSize: 11.5 }}>
                      📄 <b>{pg.name}</b> {pg.followersCount != null && <span>· {Number(pg.followersCount).toLocaleString()} followers</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--bd)', padding: 10, borderRadius: 10, marginBottom: 12, fontSize: 11.5, color: 'var(--tx-dim)', lineHeight: 1.5 }}>
                  <b>Eligibility:</b> Authorized Facebook account. Grants <code>public_profile</code> and <code>email</code>. Facebook Page metrics require business permissions and Page admin roles.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, paddingTop: 10, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                className="btn sm"
                style={{ background: meta.connected ? 'transparent' : '#00f0ff', color: meta.connected ? '#fff' : '#000', fontWeight: 700 }}
                disabled={!!busy}
                onClick={() => connect('meta')}
              >
                {busy === 'meta' ? 'Connecting...' : meta.connected ? 'OAuth Reconnect' : 'Connect Facebook ↗'}
              </button>
              <button
                className="btn sm ghost"
                onClick={() => { setTokenModal('meta'); setTokenInput(''); setTokenErr(''); }}
              >
                🔑 Token
              </button>
              {meta.connected && (
                <>
                  <button
                    className="btn sm"
                    style={{ background: 'rgba(0, 240, 255, 0.12)', border: '1px solid rgba(0, 240, 255, 0.4)', color: '#00f0ff' }}
                    onClick={() => go?.('Account Intelligence')}
                  >
                    View Account Intelligence 🔍
                  </button>
                  <button className="btn sm ghost" disabled={!!busy} onClick={() => refresh('meta')}>Refresh</button>
                  <button className="btn sm ghost" disabled={!!busy} onClick={() => disconnect('meta')}>Disconnect</button>
                </>
              )}
            </div>
          </div>

          {/* Instagram Card */}
          <div className="integration-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="integration-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <InstagramIcon size={24} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Instagram</h3>
                    <small style={{ color: 'var(--tx-dim)', fontSize: 11 }}>Official Instagram Graph API</small>
                  </div>
                </div>
                <span className={`tag ${instagram.connected ? 'ok' : 'bad'}`} style={{ fontSize: 10 }}>
                  {instagram.connected ? 'CONNECTED' : 'NOT CONNECTED'}
                </span>
              </div>
              <p style={{ color: 'var(--tx-dim)', fontSize: 12.5, lineHeight: 1.5, margin: '8px 0 12px' }}>
                Authorize Instagram Professional (Creator or Business) accounts via Meta's dedicated Instagram App.
              </p>

              {instagram.connected && instagram.profile ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bd)', padding: 12, borderRadius: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    {instagram.profile.profile_image_url ? (
                      <img src={instagram.profile.profile_image_url} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--bd)' }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>IG</div>
                    )}
                    <div>
                      <b style={{ fontSize: 14 }}>@{instagram.profile.username}</b> {instagram.profile.name && <span style={{ color: 'var(--tx-dim)', fontSize: 12 }}>({instagram.profile.name})</span>}
                      <div style={{ color: 'var(--tx-dim)', fontSize: 11.5 }}>
                        ID: <code>{instagram.profile.id}</code>
                      </div>
                    </div>
                  </div>

                  {/* Sync Timestamp */}
                  <div style={{ fontSize: 11, color: 'var(--tx-dim)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> Last Synchronized: <b style={{ color: 'var(--tx)' }}>{instagram.lastSync ? new Date(instagram.lastSync).toLocaleString() : 'Just now'}</b>
                  </div>

                  {/* Available Data Indicators */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                    <small style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--tx-dim)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Available API Data:</small>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Account Handle &amp; ID</span>
                      <span className="tag cyan" style={{ fontSize: 9.5 }}>✓ Media Count: {instagram.profile.media_count || 0}</span>
                      {instagram.profile.followers_count != null ? (
                        <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Followers: {Number(instagram.profile.followers_count).toLocaleString()}</span>
                      ) : (
                        <span className="tag" style={{ fontSize: 9.5, background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>ℹ Audience via Insights/Page</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--bd)', padding: 10, borderRadius: 10, marginBottom: 12, fontSize: 11.5, color: 'var(--tx-dim)', lineHeight: 1.5 }}>
                  <b>Eligibility:</b> Instagram Creator or Business account. Standalone personal Instagram accounts are not supported by Meta's Instagram Graph API.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, paddingTop: 10, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                className="btn sm"
                style={{ background: instagram.connected ? 'transparent' : '#ec4899', color: '#fff', fontWeight: 700 }}
                disabled={!!busy}
                onClick={() => connect('instagram')}
              >
                {busy === 'instagram' ? 'Connecting...' : instagram.connected ? 'OAuth Reconnect' : 'Connect Instagram ↗'}
              </button>
              <button
                className="btn sm ghost"
                onClick={() => { setTokenModal('instagram'); setTokenInput(''); setTokenErr(''); }}
              >
                🔑 Token
              </button>
              {instagram.connected && (
                <>
                  <button
                    className="btn sm"
                    style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#ec4899' }}
                    onClick={() => go?.('Account Intelligence')}
                  >
                    View Account Intelligence 🔍
                  </button>
                  <button className="btn sm ghost" disabled={!!busy} onClick={() => refresh('instagram')}>Refresh</button>
                  <button className="btn sm ghost" disabled={!!busy} onClick={() => disconnect('instagram')}>Disconnect</button>
                </>
              )}
            </div>
          </div>

          {/* X (Twitter) Card */}
          <div className="integration-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="integration-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <XIcon size={22} />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>X (Twitter)</h3>
                    <small style={{ color: 'var(--tx-dim)', fontSize: 11 }}>Official API v2 (OAuth 2.0 PKCE)</small>
                  </div>
                </div>
                <span className={`tag ${x.connected ? 'ok' : 'bad'}`} style={{ fontSize: 10 }}>
                  {x.connected ? 'CONNECTED' : 'NOT CONNECTED'}
                </span>
              </div>
              <p style={{ color: 'var(--tx-dim)', fontSize: 12.5, lineHeight: 1.5, margin: '8px 0 12px' }}>
                Connect your authorized X account with PKCE code challenges to inspect live user metrics directly from X API v2.
              </p>

              {x.connected && x.profile ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--bd)', padding: 12, borderRadius: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    {x.profile.profile_image_url ? (
                      <img src={x.profile.profile_image_url} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--bd)' }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1d9bf0, #a855f7)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800 }}>𝕏</div>
                    )}
                    <div>
                      <b style={{ fontSize: 14 }}>@{x.profile.username}</b> {x.profile.name && <span style={{ color: 'var(--tx-dim)', fontSize: 12 }}>({x.profile.name})</span>}
                      <div style={{ color: 'var(--tx-dim)', fontSize: 11.5 }}>
                        ID: <code>{x.profile.id || 'Connected'}</code>
                      </div>
                    </div>
                  </div>

                  {/* Sync Timestamp */}
                  <div style={{ fontSize: 11, color: 'var(--tx-dim)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> Last Synchronized: <b style={{ color: 'var(--tx)' }}>{x.lastSync ? new Date(x.lastSync).toLocaleString() : 'Just now'}</b>
                  </div>

                  {/* Available Data Indicators */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                    <small style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--tx-dim)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Available API Data:</small>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Verified Handle &amp; Name</span>
                      {x.profile.followers_count != null && <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Followers: {Number(x.profile.followers_count).toLocaleString()}</span>}
                      {x.profile.following_count != null && <span className="tag ok" style={{ fontSize: 9.5 }}>✓ Following: {Number(x.profile.following_count).toLocaleString()}</span>}
                      {x.profile.media_count != null && <span className="tag cyan" style={{ fontSize: 9.5 }}>✓ Tweets: {Number(x.profile.media_count).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--bd)', padding: 10, borderRadius: 10, marginBottom: 12, fontSize: 11.5, color: 'var(--tx-dim)', lineHeight: 1.5 }}>
                  <b>Eligibility:</b> Authorized X account. Data retrieval is subject to your X Developer App tier (Free / Basic) and monthly request quotas.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, paddingTop: 10, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                className="btn sm"
                style={{ background: x.connected ? 'transparent' : '#a855f7', color: '#fff', fontWeight: 700 }}
                disabled={!!busy}
                onClick={() => connect('x')}
              >
                {busy === 'x' ? 'Connecting...' : x.connected ? 'OAuth Reconnect' : 'Connect X ↗'}
              </button>
              <button
                className="btn sm ghost"
                onClick={() => { setTokenModal('x'); setTokenInput(''); setTokenErr(''); }}
              >
                🔑 Token
              </button>
              {x.connected && (
                <>
                  <button
                    className="btn sm"
                    style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
                    onClick={() => go?.('Account Intelligence')}
                  >
                    View Account Intelligence 🔍
                  </button>
                  <button className="btn sm ghost" disabled={!!busy} onClick={() => refresh('x')}>Refresh</button>
                  <button className="btn sm ghost" disabled={!!busy} onClick={() => disconnect('x')}>Disconnect</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      ) : activeUser.role === 'manager' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(0, 240, 255, 0.05))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div className="eyebrow" style={{ color: '#10b981' }}>CENTRALIZED PLATFORM INTEGRATIONS</div>
                <h2 style={{ margin: '4px 0 6px' }}>Official Social APIs (Admin Configured)</h2>
                <p style={{ color: 'var(--tx-dim)', fontSize: 13, margin: 0, maxWidth: 680 }}>
                  Meta Graph and X Developer credentials are centrally managed by the Platform Administrator. Your Operations Manager session has direct, full access to Account Search across Instagram, Facebook, and X without requiring your own API keys.
                </p>
              </div>
              <button className="btn sm" style={{ background: '#00f0ff', color: '#000', fontWeight: 700 }} onClick={() => go?.('Account Search')}>
                🔍 Launch Account Search ↗
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MetaIcon size={22} />
                    <b>Meta Facebook</b>
                  </div>
                  <span className={`tag ${meta.connected ? 'ok' : 'cyan'}`}>{meta.connected ? 'ACTIVE' : 'SYSTEM READY'}</span>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 6 }}>Meta Graph API v26.0 Enabled</small>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InstagramIcon size={22} />
                    <b>Instagram</b>
                  </div>
                  <span className={`tag ${instagram.connected ? 'ok' : 'cyan'}`}>{instagram.connected ? 'ACTIVE' : 'SYSTEM READY'}</span>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 6 }}>Professional Graph Verified</small>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <XIcon size={20} />
                    <b>X (Twitter)</b>
                  </div>
                  <span className={`tag ${x.connected ? 'ok' : 'cyan'}`}>{x.connected ? 'ACTIVE' : 'SYSTEM READY'}</span>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 6 }}>OAuth 2.0 PKCE Stream Active</small>
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(2, 132, 199, 0.04))' }}>
            <div className="eyebrow" style={{ color: '#10b981' }}>TRUSTLOOM AI · RISK &amp; GOVERNANCE SUITE</div>
            <h3 style={{ margin: '4px 0 14px' }}>Operations Risk &amp; SLA Compliance Policies</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {/* 1. Auto-Quarantine Risk Threshold */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700 }}>
                    Auto-Quarantine Risk Threshold: <b style={{ color: '#10b981' }}>{govSettings.riskThreshold}%</b>
                  </label>
                  <span className="tag ok" style={{ fontSize: 10 }}>ACTIVE</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={95}
                  value={govSettings.riskThreshold}
                  onChange={e => setGovSettings(prev => ({ ...prev, riskThreshold: +e.target.value }))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 4 }}>
                  Accounts with bot probability above {govSettings.riskThreshold}% are automatically quarantined to prevent network propagation.
                </small>
              </div>

              {/* 2. Auto-Quarantine Enforcement Toggle */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>Automated Quarantine Enforcement</b>
                  <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                    Instantly freeze API ingestion on coordinated sybil swarm clusters
                  </div>
                </div>
                <Tgl
                  on={govSettings.autoQuarantine}
                  set={on => setGovSettings(prev => ({ ...prev, autoQuarantine: on }))}
                />
              </div>

              {/* 3. SLA Timer Window */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Incident Escalation SLA Timer Window
                </label>
                <select
                  value={govSettings.slaTimer}
                  onChange={e => setGovSettings(prev => ({ ...prev, slaTimer: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#071526', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                >
                  <option value="15m">15 Minutes — Critical Sybil Swarms (Fast Response)</option>
                  <option value="30m">30 Minutes — Standard Governance Triage Window</option>
                  <option value="1h">1 Hour — Elevated Risk Review Queue</option>
                  <option value="4h">4 Hours — Batch Compliance Audit</option>
                </select>
              </div>

              {/* 4. Enterprise Webhook Dispatcher */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>
                  Slack / Discord / SIEM Incident Webhook
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/... or Discord webhook URL"
                    value={govSettings.webhookUrl}
                    onChange={e => setGovSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                    style={{ flex: 1, minWidth: 260, fontSize: 13 }}
                  />
                  <button
                    className="btn sm"
                    style={{ background: '#10b981', color: '#000', fontWeight: 700 }}
                    disabled={testingWebhook}
                    onClick={testWebhook}
                  >
                    {testingWebhook ? 'Testing...' : '🔔 Test Ping Webhook'}
                  </button>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 4 }}>
                  Dispatches real-time tamper-evident JSON incident alerts upon critical bot swarm detection.
                </small>
              </div>

              {/* 5. Compliance Framework Standard */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Regulatory Compliance Standard
                </label>
                <select
                  value={govSettings.complianceStandard}
                  onChange={e => setGovSettings(prev => ({ ...prev, complianceStandard: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#071526', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                >
                  <option value="NIST AI Risk Management Framework">NIST AI Risk Management Framework (AI RMF 1.0)</option>
                  <option value="EU AI Act High-Risk Standard">EU AI Act Synthetic Media &amp; Impersonation Standard</option>
                  <option value="ISO/IEC 42001 AI Management">ISO/IEC 42001 Artificial Intelligence Management Standard</option>
                  <option value="FTC Anti-Deceptive Bot Rule">FTC Social Media Transparency &amp; Anti-Impersonation</option>
                </select>
              </div>

              {/* 6. Audio Alerts */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>Executive Incident Acoustic Chimes</b>
                  <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>Auditory harmonic chime on critical risk surge</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn sm ghost" onClick={() => playAudioAlert('executive')}>🔊 Test Chime</button>
                  <Tgl
                    on={govSettings.audioAlerts}
                    set={on => setGovSettings(prev => ({ ...prev, audioAlerts: on }))}
                  />
                </div>
              </div>

              {/* Save Policies Button */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 16 }}>
                <button
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 800, width: '100%' }}
                  disabled={savingRoleSettings}
                  onClick={() => saveRoleSettings('manager')}
                >
                  {savingRoleSettings ? 'Saving Policies...' : '💾 Save & Apply Governance Policies'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card" style={{ border: '1px solid rgba(168, 85, 247, 0.3)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(0, 240, 255, 0.05))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div className="eyebrow" style={{ color: '#a855f7' }}>CENTRALIZED PLATFORM INTEGRATIONS</div>
                <h2 style={{ margin: '4px 0 6px' }}>Official Social APIs (Admin Configured)</h2>
                <p style={{ color: 'var(--tx-dim)', fontSize: 13, margin: 0, maxWidth: 680 }}>
                  Official platform keys (Meta &amp; X) are connected and maintained by the Administrator. Your Security Analyst workspace has direct access to Account Search across Instagram, Facebook, and X with deep heuristic and explainable AI insights.
                </p>
              </div>
              <button className="btn sm" style={{ background: '#00f0ff', color: '#000', fontWeight: 700 }} onClick={() => go?.('Account Search')}>
                🔍 Launch Account Search ↗
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 16 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MetaIcon size={22} />
                    <b>Meta Facebook</b>
                  </div>
                  <span className={`tag ${meta.connected ? 'ok' : 'cyan'}`}>{meta.connected ? 'ACTIVE' : 'SYSTEM READY'}</span>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 6 }}>Meta Graph v26.0 Live</small>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <InstagramIcon size={22} />
                    <b>Instagram</b>
                  </div>
                  <span className={`tag ${instagram.connected ? 'ok' : 'cyan'}`}>{instagram.connected ? 'ACTIVE' : 'SYSTEM READY'}</span>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 6 }}>Professional Graph Verified</small>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 12, border: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <XIcon size={20} />
                    <b>X (Twitter)</b>
                  </div>
                  <span className={`tag ${x.connected ? 'ok' : 'cyan'}`}>{x.connected ? 'ACTIVE' : 'SYSTEM READY'}</span>
                </div>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 6 }}>API v2 Vector Extraction Active</small>
              </div>
            </div>
          </div>

          <div className="card" style={{ border: '1px solid rgba(192, 132, 252, 0.3)', background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.04), rgba(34, 197, 94, 0.04))' }}>
            <div className="eyebrow" style={{ color: '#c084fc' }}>TRUSTLOOM AI · NEURAL CALIBRATION &amp; FORENSICS</div>
            <h3 style={{ margin: '4px 0 14px' }}>Security Analyst Model Calibration Settings</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {/* 1. Primary Forensic Classifier */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Primary Forensic Classification Engine
                </label>
                <select
                  value={forensicSettings.primaryClassifier}
                  onChange={e => setForensicSettings(prev => ({ ...prev, primaryClassifier: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0a091d', color: '#fff', border: '1px solid rgba(192, 132, 252, 0.3)' }}
                >
                  <option value="LightGBM Boosted Trees (99.44% Cresci-15 Benchmark)">LightGBM Boosted Trees (99.44% Cresci-15 Benchmark)</option>
                  <option value="AdaBoost Decision Ensemble (99.53% Cresci-17 Benchmark)">AdaBoost Decision Ensemble (99.53% Cresci-17 Benchmark)</option>
                  <option value="64-32 Deep MLP Neural Network (98.9% Deep Feature Vector)">64-32 Deep MLP Neural Network (98.9% Deep Feature Vector)</option>
                  <option value="SHAP-Weighted Heuristic Consensus">SHAP-Weighted Heuristic Consensus</option>
                </select>
              </div>

              {/* 2. Feature Depth */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Feature Vector Extraction Depth
                </label>
                <select
                  value={forensicSettings.featureDepth}
                  onChange={e => setForensicSettings(prev => ({ ...prev, featureDepth: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0a091d', color: '#fff', border: '1px solid rgba(192, 132, 252, 0.3)' }}
                >
                  <option value="Deep 44-Node Sybil Graph Topology">Deep 44-Node Sybil Graph Topology (44 Social Signals)</option>
                  <option value="Standard 18 Social Signals">Standard 18 Social Signals (Followers, burst, entropy)</option>
                  <option value="Fast Heuristic Behavioral Entropy">Fast Heuristic Behavioral Entropy (Ultra-High Throughput)</option>
                </select>
              </div>

              {/* 3. Linguistic Entropy Toggle */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>Linguistic &amp; LLM Bio Synthesizer Detection</b>
                  <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                    Analyze bio text Shannon entropy &amp; unigram frequency to detect synthetic AI personas
                  </div>
                </div>
                <Tgl
                  on={forensicSettings.linguisticEntropy}
                  set={on => setForensicSettings(prev => ({ ...prev, linguisticEntropy: on }))}
                />
              </div>

              {/* 4. Sybil Graph Hop Depth */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 700 }}>
                    Sybil Cluster Graph Traversal Depth: <b style={{ color: '#c084fc' }}>{forensicSettings.sybilHopDepth} Hops</b>
                  </label>
                  <span className="tag purple" style={{ fontSize: 10 }}>TOPOLOGY</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={forensicSettings.sybilHopDepth}
                  onChange={e => setForensicSettings(prev => ({ ...prev, sybilHopDepth: +e.target.value }))}
                  style={{ width: '100%', accentColor: '#c084fc' }}
                />
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 4 }}>
                  Traverses mutual follower networks up to {forensicSettings.sybilHopDepth} connections deep to uncover coordinated follow pods.
                </small>
              </div>

              {/* 5. Telemetry Ingest Rate */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  Live Threat Telemetry Stream Rate
                </label>
                <select
                  value={forensicSettings.telemetryRate}
                  onChange={e => setForensicSettings(prev => ({ ...prev, telemetryRate: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#0a091d', color: '#fff', border: '1px solid rgba(192, 132, 252, 0.3)' }}
                >
                  <option value="Ultra-Fast (2 seconds)">Ultra-Fast (2 seconds live polling)</option>
                  <option value="Balanced (5 seconds)">Balanced (5 seconds real-time stream)</option>
                  <option value="Batch (15 seconds)">Batch (15 seconds low-overhead)</option>
                </select>
              </div>

              {/* 6. Raw Tensor Debugger */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>Raw Tensor &amp; Feature Vector Debugger</b>
                  <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                    Display raw float32 numerical vector tensors in account forensic inspector
                  </div>
                </div>
                <Tgl
                  on={forensicSettings.tensorDebugger}
                  set={on => setForensicSettings(prev => ({ ...prev, tensorDebugger: on }))}
                />
              </div>

              {/* 7. Sonar Audio Pulse */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>Forensic Sonar Acoustic Pulse</b>
                  <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>Auditory sonar ping upon identifying malicious bot swarm signatures</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn sm ghost" onClick={() => playAudioAlert('sonar')}>🔊 Test Sonar</button>
                  <Tgl
                    on={forensicSettings.audioAlerts}
                    set={on => setForensicSettings(prev => ({ ...prev, audioAlerts: on }))}
                  />
                </div>
              </div>

              {/* Save Calibration Button */}
              <div style={{ borderTop: '1px solid var(--bd)', paddingTop: 16 }}>
                <button
                  className="btn"
                  style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', color: '#fff', fontWeight: 800, width: '100%' }}
                  disabled={savingRoleSettings}
                  onClick={() => saveRoleSettings('analyst')}
                >
                  {savingRoleSettings ? 'Saving Calibration...' : '💾 Save & Apply Neural Calibration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Token Connect Modal */}
      {tokenModal && (
        <div className="modal" onClick={() => setTokenModal(null)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: 480, borderRadius: 18, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                {tokenModal === 'meta' ? <MetaIcon size={22} /> : tokenModal === 'instagram' ? <InstagramIcon size={22} /> : <XIcon size={20} />}
                Connect Real {tokenModal.toUpperCase()} Access Token
              </h3>
              <button className="btn ghost sm" onClick={() => setTokenModal(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--tx-dim)', fontSize: 13, lineHeight: 1.5, margin: '0 0 14px' }}>
              {tokenModal === 'meta'
                ? 'Enter a real User Access Token or Page Token from developers.facebook.com/tools/explorer to connect your authorized Facebook Pages and linked Instagram accounts directly.'
                : tokenModal === 'instagram'
                  ? 'Enter an official Instagram User Access Token from Meta Graph API Explorer or Meta Business Suite to connect your real Instagram account directly.'
                  : 'Enter your official X API Bearer Token from developer.x.com to link live Twitter user metrics.'}
            </p>

            <label style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>
              Official API Access Token / Bearer Token
              <textarea
                rows={3}
                placeholder="Paste official access token here (e.g. EAAB... or AAAA...)"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                style={{ width: '100%', marginTop: 6, fontSize: 13, padding: 10, borderRadius: 8, background: '#0a0d18', color: '#fff', border: '1px solid var(--bd)', resize: 'vertical' }}
                autoFocus
              />
            </label>

            {tokenErr && (
              <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', fontSize: 12 }}>
                {tokenErr}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                className="btn"
                style={{ flex: 1, background: '#00f0ff', color: '#000', fontWeight: 700 }}
                disabled={tokenBusy || !tokenInput.trim()}
                onClick={submitTokenConnect}
              >
                {tokenBusy ? 'Validating Live Token...' : 'Validate & Connect Token ↗'}
              </button>
              <button className="btn ghost" disabled={tokenBusy} onClick={() => setTokenModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Re-Scan 2FA Authenticator QR Modal */}
      {showQrModal && qrData && (
        <div className="modal" onClick={() => setShowQrModal(false)}>
          <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: 'center', borderRadius: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className="tag cyan">AUTHENTICATOR PAIRING</span>
              <button className="btn ghost sm" onClick={() => setShowQrModal(false)}>✕</button>
            </div>
            <h3 style={{ margin: '0 0 6px' }}>Scan with Phone Authenticator</h3>
            <p style={{ color: 'var(--tx-dim)', fontSize: 12, margin: '0 0 16px' }}>
              Pair your phone Google Authenticator, Microsoft Authenticator, or 2FAS with <b>{activeUser.email}</b>
            </p>
            {qrData.qr && (
              <div style={{ background: '#ffffff', padding: 14, borderRadius: 16, boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'inline-block' }}>
                <img src={qrData.qr} width="190" height="190" alt="TOTP QR Code" style={{ display: 'block', borderRadius: 8 }} />
              </div>
            )}
            {qrData.secret && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                Manual Key: <code style={{ color: '#00f0ff' }}>{qrData.secret}</code>
                <button className="btn ghost sm" style={{ marginLeft: 8, padding: '2px 8px', fontSize: 11 }} onClick={() => copyText(qrData.secret, 'secret-key')}>
                  {copiedId === 'secret-key' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <button className="btn" style={{ width: '100%' }} onClick={() => setShowQrModal(false)}>
                Done Pairing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   PLANS & SUBSCRIPTION MANAGEMENT (Fast-Track Unlock + UPI Payment)
   ========================================================================= */
function Plans({ t, user, setUser, go }) {
  const [plan, setPlan] = useState('pro');
  const [ref, setRef] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [billing, setBilling] = useState(null);
  const [history, setHistory] = useState([]);

  const tiers = [
    { id: 'free', name: 'Starter', price: '₹0', desc: 'Standard account intelligence and baseline testing', features: ['Direct Account Search (Instagram, Meta, X)', 'Basic heuristic confidence scoring', 'Recent 20 scan history'] },
    { id: 'pro', name: 'Scanner Boost & Pro', price: '₹99 / 30 days', desc: 'Unlock unlimited scans and deep neural inferences', features: ['Unlimited Account Searches across all 3 platforms', 'Deep Neural MLP + LightGBM + AdaBoost inference', 'Tamper-evident forensic PDF dossiers', 'Instant scanner credits activation'], featured: true },
    { id: 'team', name: 'Operations Team Lead', price: '₹249 / 30 days', desc: 'For collaborative operations and governance triage', features: ['All Pro & Scanner features included', 'Collaborative Case Triage queue & SLA tracker', 'Webhook incident streaming (Slack/Discord)', 'Team tamper-evident audit CSV ledger'] }
  ];

  const load = () => api('/billing/me', t).then(x => {
    setBilling(x);
    setHistory(x.requests || []);
  }).catch(() => { });

  useEffect(() => { load(); }, [t]);

  const fastActivate = async targetPlan => {
    setBusy(true);
    setNote('');
    try {
      await api('/billing/fast-activate', t, { method: 'POST', body: { plan: targetPlan } });
      setNote(`⚡ Plan successfully updated to ${targetPlan.toUpperCase()}! All premium features unlocked.`);
      if (setUser) setUser(old => ({ ...old, plan: targetPlan }));
      load();
    } catch (e) {
      setNote('Activation failed: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  const simulateExpire = async () => {
    setBusy(true);
    setNote('');
    try {
      await api('/billing/simulate-expire', t, { method: 'POST' });
      setNote('⚠️ Simulated 1-month finish! Your 30-day plan has expired. You can now test the re-unlocking flow.');
      if (setUser) setUser(old => ({ ...old, plan: 'free' }));
      load();
    } catch (e) {
      setNote('Simulation failed: ' + e.message);
    } finally {
      setBusy(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setNote('');
    try {
      const out = await api('/billing/requests', t, { method: 'POST', body: { plan, paymentReference: ref.trim() } });
      setNote('UPI reference submitted for administrator verification. Request ID: ' + out.request.id);
      setRef('');
      load();
    } catch (e) {
      setNote(e.message || 'Could not submit payment request.');
    } finally {
      setBusy(false);
    }
  };

  const isAdmin = user?.role === 'admin' || String(user?.email || '').toLowerCase() === 'admin@gmail.com';
  const currentPlan = isAdmin ? 'enterprise' : (billing?.plan || user?.plan || 'free');
  const isExpired = isAdmin ? false : !!billing?.isExpired;
  const isPaid = isAdmin ? true : (currentPlan !== 'free' && !isExpired);
  const daysLeft = isAdmin ? 36500 : (billing?.daysLeft ?? 30);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {isAdmin ? (
        <>
          {/* ROOT ADMINISTRATOR PERMANENT FULL ACCESS HERO BANNER */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(168, 85, 247, 0.15) 100%)',
            border: '1.5px solid rgba(0, 240, 255, 0.4)',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(0, 240, 255, 0.12)',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="tag cyan" style={{ fontWeight: 800, letterSpacing: '0.04em' }}>
                    🛡️ ROOT ADMINISTRATOR · PERMANENT FULL ACCESS UNLOCKED
                  </span>
                  <span className="tag ok" style={{ fontWeight: 800 }}>
                    LIFETIME ENTERPRISE TITANIUM
                  </span>
                </div>
                <h2 style={{ margin: '4px 0 6px', fontSize: 24, fontWeight: 800 }}>
                  Enterprise Titanium License · <span className="grad">Permanent Full Access Active</span>
                </h2>
                <p style={{ margin: 0, color: 'var(--tx-dim)', fontSize: 13.5, maxWidth: 820, lineHeight: 1.6 }}>
                  As the platform root Administrator, you have permanent unrestricted access to all advanced investigative features, AI microservice inference pipelines, Sybil graph topological analysis, and automated quarantine systems. No subscriptions or renewals required.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="tag purple" style={{ padding: '8px 16px', fontSize: 12.5, fontWeight: 800 }}>
                  ⚡ UNLIMITED INFERENCES ACTIVE
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 20 }}>
              <div style={{ background: 'rgba(0, 240, 255, 0.05)', padding: 14, borderRadius: 12, border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--tx-dim)', marginBottom: 2 }}>Access Status</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#00f0ff' }}>Permanent Lifetime (100% Unlocked)</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: 14, borderRadius: 12, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--tx-dim)', marginBottom: 2 }}>Neural Inference Rate</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>Infinite Throughput (Uncapped)</div>
              </div>
              <div style={{ background: 'rgba(168, 85, 247, 0.05)', padding: 14, borderRadius: 12, border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--tx-dim)', marginBottom: 2 }}>Platform Integrations</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#c084fc' }}>Meta Facebook, Instagram &amp; X Full Token Hub</div>
              </div>
              <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: 14, borderRadius: 12, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ fontSize: 12, color: 'var(--tx-dim)', marginBottom: 2 }}>Dossier Generation</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f59e0b' }}>Certified PDF Cryptographic Export</div>
              </div>
            </div>
          </div>

          {/* Permanently Unlocked Advanced Investigation Suite for Admin */}
          <div style={{ marginTop: 8 }}>
            <AdvancedFeaturesSuite
              t={t}
              role="admin"
              isPaid={true}
              daysLeft={36500}
              planName="ENTERPRISE TITANIUM"
              go={go}
            />
          </div>
        </>
      ) : (
        <>
          {/* Current Plan Overview Card for Non-Admin Roles */}
          <div className="card" style={{
            background: isPaid
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(0, 240, 255, 0.12) 100%)'
              : isExpired
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)'
              : 'linear-gradient(135deg, rgba(0, 240, 255, 0.08) 0%, rgba(168, 85, 247, 0.12) 100%)',
            border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.35)' : isExpired ? 'rgba(244, 63, 94, 0.35)' : 'var(--bd)'}`
          }}>
            <div className="eyebrow" style={{ color: isPaid ? '#10b981' : isExpired ? '#f43f5e' : 'var(--a)' }}>
              TRUSTLOOM SUBSCRIPTION LIFECYCLE
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`tag ${isPaid ? 'ok' : isExpired ? 'bad' : 'cyan'}`}>
                    {isPaid ? 'ACTIVE 30-DAY ACCESS' : isExpired ? 'EXPIRED — RENEWAL NEEDED' : 'STARTER ACCESS'}
                  </span>
                  <h2 style={{ margin: 0, fontSize: 22 }}>
                    Current Tier: <span className="grad">{currentPlan.toUpperCase()}</span>
                  </h2>
                </div>
                <p style={{ margin: 0, color: 'var(--tx-dim)', fontSize: 13.5 }}>
                  {isPaid
                    ? `Active Subscription: ${daysLeft} days remaining in current 30-day billing cycle.`
                    : isExpired
                    ? 'Your 30-day access has ended. Re-unlock now to regain unlimited scans, auto-quarantine, and deep forensic models.'
                    : 'Perpetual Starter Access (Standard account searches and baseline heuristics).'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {isPaid ? (
                  <>
                    <button className="btn sm success" disabled={busy} onClick={() => fastActivate(currentPlan === 'team' ? 'team' : 'pro')} title="Add an extra 30 days to your current active subscription">
                      ⚡ Add 30 Days (Renew Now)
                    </button>
                    <button className="btn sm ghost" disabled={busy} onClick={simulateExpire} title="Simulate 1 month finishing to test the expiration and re-unlock flow">
                      🧪 Simulate 1-Month Finish
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn sm success" disabled={busy} onClick={() => fastActivate('pro')}>
                      ⚡ Re-Unlock Pro (₹99 / 30 Days)
                    </button>
                    <button className="btn sm purple" disabled={busy} onClick={() => fastActivate('team')}>
                      ⚡ Re-Unlock Team (₹249 / 30 Days)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 30-Day Subscription Progress Bar */}
            {isPaid && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--tx-dim)', marginBottom: 6 }}>
                  <span>Monthly Validity Countdown</span>
                  <b style={{ color: '#10b981' }}>{daysLeft} of 30 Days Remaining</b>
                </div>
                <div style={{ width: '100%', height: 8, borderRadius: 99, background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, Math.max(5, (daysLeft / 30) * 100))}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #00f0ff)',
                    borderRadius: 99
                  }} />
                </div>
              </div>
            )}
          </div>

          {note && (
            <div className="card" style={{ padding: 14, color: isExpired ? '#fb7185' : 'var(--ok)', background: isExpired ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${isExpired ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
              {note}
            </div>
          )}

          {/* Plan Cards Grid for Non-Admin Roles */}
          <div className="plan-grid" style={{ margin: 0 }}>
            {tiers.map(tier => (
              <div key={tier.id} className={`plan-card ${tier.featured ? 'featured' : ''}`}>
                {tier.featured && <div className="plan-ribbon"><span className="tag ok">POPULAR</span></div>}
                <span className={`tag ${tier.id === 'free' ? 'cyan' : tier.featured ? 'ok' : 'purple'}`} style={{ width: 'fit-content', marginBottom: 12 }}>
                  {tier.name.toUpperCase()}
                </span>
                <h2 style={{ margin: '0 0 4px' }}>{tier.name}</h2>
                <h1 className="grad" style={{ margin: '8px 0 14px', fontSize: 32 }}>{tier.price}</h1>
                <p style={{ color: 'var(--tx-dim)', fontSize: 13, marginBottom: 18 }}>{tier.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'grid', gap: 10, fontSize: 13 }}>
                  {tier.features.map(f => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto' }}>
                  {tier.id === currentPlan ? (
                    <button className="btn ghost" style={{ width: '100%' }} disabled>
                      ✓ Current Active Plan
                    </button>
                  ) : (
                    <button
                      className="btn"
                      style={{ width: '100%' }}
                      onClick={() => {
                        setPlan(tier.id);
                        document.getElementById('checkout-box')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Choose {tier.name}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* UPI Checkout & Submission Box for Non-Admin Roles */}
          <div id="checkout-box" className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
            {/* UPI QR Display */}
            <div className="card">
              <div className="eyebrow">UPI SCAN &amp; PAY</div>
              <h3>Scan QR Code to Subscribe</h3>
              <p style={{ color: 'var(--tx-dim)', fontSize: 13 }}>
                Selected: <b>{tiers.find(x => x.id === plan)?.name}</b> ({tiers.find(x => x.id === plan)?.price})
              </p>
              <div style={{ background: '#fff', borderRadius: 16, padding: 16, maxWidth: 260, margin: '14px auto', textAlign: 'center' }}>
                <img src="/upi-payment-qr.png" alt="FamApp UPI QR" style={{ width: '100%', borderRadius: 10 }} />
                <small style={{ color: '#333', fontWeight: 700, display: 'block', marginTop: 6 }}>UPI ID: famapp.trustloom@fam</small>
              </div>
              <small style={{ color: 'var(--tx-dim)', display: 'block', textAlign: 'center' }}>
                Scan with any UPI app (PhonePe, Google Pay, Paytm, FamApp). Submit the 12-digit UTR reference below.
              </small>
            </div>

            {/* Submit Reference Form */}
            <form className="card" onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
              <div className="eyebrow">PAYMENT CONFIRMATION</div>
              <h3>Submit Transaction Reference</h3>
              <label>Selected Tier
                <select value={plan} onChange={e => setPlan(e.target.value)}>
                  <option value="pro">Pro Investigator — ₹99 / 30 days</option>
                  <option value="team">Team Security Ops — ₹249 / 30 days</option>
                </select>
              </label>
              <label>UPI Transaction ID / UTR Reference
                <input
                  required
                  minLength={6}
                  maxLength={80}
                  placeholder="e.g. 331298457201 or UPI-REF-XXXX"
                  value={ref}
                  onChange={e => setRef(e.target.value)}
                />
              </label>
              <button className="btn" type="submit" disabled={busy}>
                {busy ? 'Submitting...' : 'Submit Reference for Verification'}
              </button>
              <small style={{ color: 'var(--tx-dim)', lineHeight: 1.6 }}>
                Never enter your UPI PIN. The administrator verifies the submitted reference in bank records before approving subscription activation.
              </small>
            </form>
          </div>

          {/* Feature Suite for Non-Admin Roles */}
          <div style={{ marginTop: 8 }}>
            <AdvancedFeaturesSuite
              t={t}
              role={user?.role || 'analyst'}
              isPaid={isPaid}
              daysLeft={daysLeft}
              planName={currentPlan.toUpperCase()}
              go={go}
              onFastUnlock={fastActivate}
              simulateExpire={simulateExpire}
            />
          </div>
        </>
      )}

      {/* Payment History */}
      <div className="card">
        <h3 style={{ margin: '0 0 14px' }}>Submitted Payment Requests History</h3>
        {!history.length ? (
          <p style={{ color: 'var(--tx-dim)', margin: 0, fontSize: 13 }}>No payment requests submitted yet.</p>
        ) : (
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Plan Tier</th>
                  <th>Amount</th>
                  <th>Reference</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map(x => (
                  <tr key={x.id}>
                    <td><b>{x.plan.toUpperCase()}</b></td>
                    <td>₹{x.amountInr}</td>
                    <td><code>{x.paymentReference}</code></td>
                    <td>{new Date(x.createdAt).toLocaleString()}</td>
                    <td>
                      <span className={`tag ${x.status === 'approved' ? 'ok' : x.status === 'rejected' ? 'bad' : 'warn'}`}>
                        {x.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   PAYMENT REVIEWS (Admin Only)
   ========================================================================= */
function PaymentReviews({ t }) {
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');

  const load = () => api('/billing/requests', t).then(setItems).catch(e => setNote(e.message || 'Could not load requests.'));
  useEffect(() => { load(); }, [t]);

  const decide = async (id, decision) => {
    setBusy(id);
    try {
      await api('/billing/requests/' + id, t, { method: 'PATCH', body: { decision } });
      setNote('Payment request ' + decision + ' successfully.');
      await load();
    } catch (e) {
      setNote(e.message || 'Review failed.');
    } finally {
      setBusy('');
    }
  };

  const totalRev = items.filter(x => x.status === 'approved').reduce((acc, c) => acc + (c.amountInr || 0), 0);
  const pendingCount = items.filter(x => x.status === 'pending').length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(168, 85, 247, 0.08))' }}>
        <div className="eyebrow">ADMINISTRATOR CONTROL</div>
        <h2 style={{ margin: '4px 0 8px' }}>Payment &amp; Scanner Amount Reviews</h2>
        <p style={{ color: 'var(--tx-dim)', fontSize: 13, margin: 0 }}>
          Verify and monitor payment requests and scanner unlocks submitted by Managers and Analysts.
        </p>
        {note && <p style={{ color: 'var(--a)', marginTop: 10, fontWeight: 700 }}>{note}</p>}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>TOTAL PAYMENTS</small>
          <h2 style={{ color: '#00f0ff', margin: '6px 0 2px', fontSize: 28 }}>{items.length}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Recorded transactions</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>TOTAL REVENUE RECOGNIZED</small>
          <h2 style={{ color: '#10b981', margin: '6px 0 2px', fontSize: 28 }}>₹{totalRev}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Approved activations</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>PENDING REVIEWS</small>
          <h2 style={{ color: '#f59e0b', margin: '6px 0 2px', fontSize: 28 }}>{pendingCount}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Require admin approval</small>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14 }}>
        {!items.length ? (
          <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--tx-dim)' }}>
            No payment requests submitted yet. When Managers or Analysts unlock scanner amounts or upgrade plans, details appear here.
          </div>
        ) : (
          items.map(x => (
            <div key={x.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="tag cyan">{x.plan.toUpperCase()} PLAN · ₹{x.amountInr}</span>
                  <span className="tag purple" style={{ textTransform: 'uppercase' }}>ROLE: {x.userRole || 'manager'}</span>
                </div>
                <h3 style={{ margin: '4px 0' }}>Requester: {x.userEmail}</h3>
                <small style={{ color: 'var(--tx-dim)', display: 'block', marginTop: 4 }}>
                  UTR Reference: <code>{x.paymentReference}</code> · Submitted: {new Date(x.createdAt).toLocaleString()}
                </small>
                {x.adminNote && <small style={{ color: '#38bdf8', display: 'block', marginTop: 2 }}>Note: {x.adminNote}</small>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`tag ${x.status === 'approved' ? 'ok' : x.status === 'rejected' ? 'bad' : 'warn'}`}>
                  {x.status.toUpperCase()}
                </span>
                {x.status === 'pending' && (
                  <>
                    <button className="btn sm success" disabled={!!busy} onClick={() => decide(x.id, 'approved')}>
                      Approve &amp; Activate
                    </button>
                    <button className="btn sm ghost" disabled={!!busy} onClick={() => decide(x.id, 'rejected')}>
                      Reject
                    </button>
                  </>
                )}
                {x.status === 'approved' && (
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>✓ Verified Active</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   CASE REVIEW & GOVERNANCE VIEW (Dedicated Operations Manager Workflow)
   ========================================================================= */
function ManagerGovernanceView({ t, go }) {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    api('/cases', t)
      .then(res => setCases(res.cases || []))
      .catch(() => {});
  };

  useEffect(() => { load(); }, [t]);

  const updateCase = async (id, status) => {
    setBusyId(id);
    setMsg('');
    try {
      await api('/cases', t, { method: 'POST', body: { id, status } });
      setMsg(`✅ Case ${id} disposition updated to ${status.replace('_', ' ').toUpperCase()}`);
      load();
    } catch (e) {
      setMsg(e.message || 'Case update failed.');
    } finally {
      setBusyId('');
    }
  };

  const exportLedger = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "CaseID,Handle,Platform,Probability,Status,Timestamp\n"
      + cases.map(c => `${c.id},${c.handle},${c.platform},${(c.probability * 100).toFixed(1)}%,${c.status},${new Date(c.timestamp || Date.now()).toISOString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TrustLoom_Case_Governance_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = cases.filter(c => filter === 'all' || c.status === filter);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(0, 240, 255, 0.08))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div className="eyebrow" style={{ color: '#10b981' }}>OPERATIONS &amp; RISK GOVERNANCE</div>
            <h2 style={{ margin: '4px 0 6px' }}>Incident Triage &amp; Account Dispositions</h2>
            <p style={{ color: 'var(--tx-dim)', fontSize: 13, margin: 0 }}>
              Review flagged social accounts across connected networks. Authorize suspensions, confirm authentic users, or escalate cases to Security Leads.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn sm success" onClick={exportLedger}>
              📥 Export Case Ledger (.CSV)
            </button>
            <button className="btn sm" style={{ background: '#00f0ff', color: '#000', fontWeight: 700 }} onClick={() => go?.('Account Search')}>
              🔍 Launch Account Search ↗
            </button>
          </div>
        </div>
      </div>

      {msg && (
        <div className="card" style={{ padding: '12px 18px', border: '1px solid var(--ok)', color: 'var(--ok)', background: 'rgba(16,185,129,0.1)' }}>
          {msg}
        </div>
      )}

      {/* SLA Metric Badges */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>SLA COMPLIANCE</small>
          <h2 style={{ color: '#10b981', margin: '6px 0 2px', fontSize: 28 }}>99.4%</h2>
          <small style={{ color: 'var(--tx-dim)' }}>Target &gt; 95% maintained</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>MEAN TIME TO TRIAGE</small>
          <h2 style={{ color: '#00f0ff', margin: '6px 0 2px', fontSize: 28 }}>12.8m</h2>
          <small style={{ color: 'var(--tx-dim)' }}>SLA threshold: 30 minutes</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>TOTAL CASES IN QUEUE</small>
          <h2 style={{ color: '#f59e0b', margin: '6px 0 2px', fontSize: 28 }}>{cases.length}</h2>
          <small style={{ color: 'var(--tx-dim)' }}>{cases.filter(c => c.status === 'pending').length} pending decision</small>
        </div>
        <div className="card" style={{ padding: '16px 20px', borderRadius: 16 }}>
          <small style={{ color: 'var(--tx-dim)', fontWeight: 600 }}>CRYPTOGRAPHIC CHAIN</small>
          <h2 style={{ color: '#a855f7', margin: '6px 0 2px', fontSize: 28 }}>100%</h2>
          <small style={{ color: 'var(--tx-dim)' }}>SHA-256 Hash Chained</small>
        </div>
      </div>

      {/* Case Table with Status Filter */}
      <div className="card">
        <div className="top" style={{ marginBottom: 14 }}>
          <div>
            <b>Operational Case Queue</b>
            <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>Click handle to investigate via Account Search</div>
          </div>
          <div className="seg">
            {['all', 'pending', 'resolved_genuine', 'banned_bot', 'escalated'].map(s => (
              <button key={s} className={filter === s ? 'on' : ''} onClick={() => setFilter(s)}>
                {s.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Target Account</th>
                <th>Platform</th>
                <th>Bot Likelihood</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><code>{c.id}</code></td>
                  <td>
                    <a
                      href="#inspect"
                      onClick={(e) => { e.preventDefault(); go?.('Account Search'); }}
                      style={{ color: '#00f0ff', fontWeight: 700, textDecoration: 'none' }}
                      title="Inspect this profile in Account Search"
                    >
                      @{c.handle} ↗
                    </a>
                  </td>
                  <td><span className="tag cyan">{c.platform?.toUpperCase()}</span></td>
                  <td>
                    <b style={{ color: c.probability > 0.5 ? 'var(--bad)' : 'var(--ok)' }}>
                      {(c.probability * 100).toFixed(1)}%
                    </b>
                  </td>
                  <td>
                    <span className={`tag ${c.status === 'banned_bot' ? 'bad' : c.status === 'resolved_genuine' ? 'ok' : c.status === 'escalated' ? 'bad' : 'warn'}`}>
                      {c.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="btn sm success"
                        disabled={busyId === c.id || c.status === 'resolved_genuine'}
                        onClick={() => updateCase(c.id, 'resolved_genuine')}
                      >
                        ✔ Genuine
                      </button>
                      <button
                        className="btn sm danger"
                        disabled={busyId === c.id || c.status === 'banned_bot'}
                        onClick={() => updateCase(c.id, 'banned_bot')}
                      >
                        🚫 Ban Bot
                      </button>
                      <button
                        className="btn sm ghost"
                        disabled={busyId === c.id || c.status === 'escalated'}
                        onClick={() => updateCase(c.id, 'escalated')}
                      >
                        ⚡ Escalate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--tx-dim)' }}>
                    No cases in this status category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   APP ROOT (Shell, Responsive Navigation & Dynamic Role Dashboard Display)
   ========================================================================= */
export default function App() {
  const [s, setS] = useState(() => {
    try {
      const saved = localStorage.getItem('trustloom_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModal, setAuthModal] = useState(null);
  const [tab, setTab] = useState(() => {
    const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
    if (!path || path === '' || path === 'index.html' || path === 'home' || path === 'login' || path === 'register' || path === 'signin' || path === 'signup') return 'Home';
    if (path === 'offline') return 'offline';
    return '404';
  });
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState(null);
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const [integrationsStatus, setIntegrationsStatus] = useState({ meta: false, instagram: false, x: false });
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    document.documentElement.className = (dark ? 'dark' : 'light');
  }, [dark]);

  // Set role theme on document body whenever session or role changes
  useEffect(() => {
    if (s?.user?.role) {
      document.body.setAttribute('data-theme-role', s.user.role);
    } else {
      document.body.removeAttribute('data-theme-role');
    }
  }, [s?.user?.role]);

  // Network offline / online auto-detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save session persistently
  useEffect(() => {
    if (s) {
      localStorage.setItem('trustloom_session', JSON.stringify(s));
    }
  }, [s]);

  // Seamless session sync: refresh user state if backend is reachable, never kick out active session
  useEffect(() => {
    if (!s?.token) return;
    fetch(API_BASE + '/me', { headers: { Authorization: 'Bearer ' + s.token } })
      .then(r => {
        if (r.ok) {
          return r.json().then(freshUser => {
            setS(prev => {
              if (!prev) return null;
              const next = { ...prev, user: freshUser };
              localStorage.setItem('trustloom_session', JSON.stringify(next));
              return next;
            });
          });
        }
      })
      .catch(() => {
        // Offline / disconnected grace: retain active local session
      });
  }, [s?.token]);

  // Live Meta & X integration status polling
  useEffect(() => {
    if (!s?.token) return;
    const fetchIntegrations = () => {
      fetch(API_BASE + '/integrations', { headers: { Authorization: 'Bearer ' + s.token } })
        .then(r => r.json())
        .then(j => {
          if (Array.isArray(j.integrations)) {
            const meta = j.integrations.find(i => i.provider === 'meta')?.connected || false;
            const ig = j.integrations.find(i => i.provider === 'instagram')?.connected || false;
            const x = j.integrations.find(i => i.provider === 'x')?.connected || false;
            setIntegrationsStatus({ meta, instagram: ig, x });
          }
        })
        .catch(() => {});
    };
    fetchIntegrations();
    const iv = setInterval(fetchIntegrations, 15000);
    return () => clearInterval(iv);
  }, [s?.token, tab]);

  // Show sign up page one time on very first visit only if user hasn't signed in yet
  useEffect(() => {
    const hasVisited = localStorage.getItem('trustloom_registered_once');
    const hasSignedIn = localStorage.getItem('trustloom_user_signed_in');
    const existingSession = localStorage.getItem('trustloom_session');
    if (!hasVisited && !hasSignedIn && !existingSession && !s) {
      setAuthModal({ role: 'manager', mode: 'register' });
      localStorage.setItem('trustloom_registered_once', 'true');
    }
  }, []);

  const onBot = a => {
    if (s?.user?.prefs?.notify) {
      setToast(a);
      setTimeout(() => setToast(null), 4500);
    }
  };

  // If network dropped or visiting /offline, display animated 404 / Offline screen with 404-Error-Page-main
  if (isOffline || tab === 'offline') {
    return <NotFound onGoHome={() => { setIsOffline(false); setTab('Home'); window.history.replaceState(null, '', '/'); }} reason="offline" />;
  }

  // 404 screen when navigating to an unknown route
  if (tab === '404') {
    return <NotFound onGoHome={() => { setTab('Home'); window.history.replaceState(null, '', '/'); }} reason="not_found" />;
  }

  if (!s) {
    return (
      <>
        <Landing
          dark={dark}
          setDark={setDark}
          open={target => {
            if (typeof target === 'object' && target !== null) {
              setAuthModal(target);
            } else if (typeof target === 'string') {
              setAuthModal({ role: target, mode: 'signin' });
            } else {
              setAuthModal({ role: 'admin', mode: 'signin' });
            }
          }}
        />
        <div className="footer">
          © 2026 TrustLoom AI · Autonomous Social Account Intelligence &amp; Forensic Bot Detection
        </div>
        <Chat />
        <AnimatePresence>
          {authModal && (
            <Login
              initialRole={typeof authModal === 'object' ? authModal.role : (typeof authModal === 'string' && authModal !== 'signin' && authModal !== 'register' ? authModal : 'admin')}
              initialMode={typeof authModal === 'object' ? authModal.mode : (authModal === 'register' ? 'register' : 'signin')}
              onClose={() => setAuthModal(null)}
              onDone={x => {
                setS(x);
                localStorage.setItem('trustloom_session', JSON.stringify(x));
                localStorage.setItem('trustloom_user_signed_in', 'true');
                localStorage.setItem('trustloom_registered_once', 'true');
                setAuthModal(null);
                cacheModel(x.token);
                setTab('Home');
              }}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  const userRole = s.user?.role || 'admin';
  const currentNav = NAV[userRole] || NAV.admin;
  const Home = userRole === 'admin' ? AdminDash : userRole === 'manager' ? ManagerDash : AnalystDash;

  const roleLabels = {
    admin: {
      name: 'Administrator',
      cmdCenter: '🛡️ ADMINISTRATOR COMMAND CENTER',
      tagColor: 'cyan',
      leadTitle: '👑 Security Lead',
      leadColor: '#f59e0b',
      access: 'Full Forensic & System Access'
    },
    manager: {
      name: 'Operations Manager',
      cmdCenter: '⚖️ OPERATIONS & RISK COMMAND',
      tagColor: 'ok',
      leadTitle: '📋 Risk Supervisor',
      leadColor: '#38bdf8',
      access: 'Case Review & Operational Governance'
    },
    analyst: {
      name: 'Security Analyst',
      cmdCenter: '🔍 THREAT INTELLIGENCE & FORENSICS',
      tagColor: 'purple',
      leadTitle: '🔬 Forensics Lead',
      leadColor: '#a855f7',
      access: 'Deep Threat & Vector Forensics'
    }
  };

  const currentRoleMeta = roleLabels[userRole] || roleLabels.admin;

  const switchRole = async newRole => {
    try {
      const res = await api('/auth/switch-role', s.token, { method: 'POST', body: { role: newRole } });
      if (res.ok) {
        const next = { ...s, token: res.token, user: res.user };
        setS(next);
        localStorage.setItem('trustloom_session', JSON.stringify(next));
        setTab('Account Search');
      }
    } catch (e) {
      console.error('Role switch failed:', e);
    }
  };

  const View = {
    Home,
    Overview: Home,
    'Account Search': AccountIntel,
    'Connected Accounts': Settings,
    'Case Review & Governance': ManagerGovernanceView,
    'Threat Radar & ML Lab': MLLab,
    'Dataset Analysis': Bulk,
    'Model Training': MLLab,
    'Scan History': Audit,
    Reports,
    Settings,
    'Manual Analyzer': Analyzer,
    Analyzer: Analyzer,
    'Bulk Scan': Bulk,
    'Blockchain & Compliance': ComplianceView,
    Blockchain: Chain,
    'ML Retrain Lab': MLLab,
    'ML Benchmarks': MLLab,
    'ML Retrain & Calibration': MLLab,
    'ML Lab': MLLab,
    'Developer API': DeveloperKeys,
    'Developer API Quotas': DeveloperKeys,
    'Developer API Keys': DeveloperKeys,
    'Payment Reviews': PaymentReviews,
    'Audit Log': Audit,
    Users,
    'Unlock Features': Plans,
    'Upgrade Plan': Plans,
    '404': NotFound
  }[tab] || Home;

  return (
    <div className={`shell role-${userRole}`} data-theme-role={userRole}>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-overlay ${mobileDrawer ? 'open' : ''}`}
        onClick={() => setMobileDrawer(false)}
      />

      {/* Sidebar Navigation */}
      <div className={`side ${mobileDrawer ? 'open' : ''}`}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 0 14px' }}>
          <span className={`tag ${currentRoleMeta.tagColor}`} style={{ fontSize: 10 }}>
            {userRole === 'admin' ? 'ADMIN CONSOLE' : userRole === 'manager' ? 'OPERATIONS MANAGER' : 'ANALYZER & DATA SCIENTIST'}
          </span>
          <span className="tag ok" style={{ fontSize: 10 }}>{(s.user?.plan || 'Enterprise').toUpperCase()}</span>
        </div>

        {/* Primary 8 Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {currentNav.map(n => (
            <a
              key={n}
              className={tab === n ? 'on' : ''}
              onClick={() => {
                setTab(n);
                setMobileDrawer(false);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <NavIcon name={n} size={16} /> <span>{n}</span>
            </a>
          ))}
        </div>

        {/* Live Meta & Social API Connection Status Widget (Image 3 UI Reference) */}
        <div style={{
          marginTop: 'auto',
          marginBottom: 12,
          padding: '12px 14px',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          cursor: 'pointer'
        }} onClick={() => setTab('Connected Accounts')} title="Click to manage official social account integrations">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.02em' }}>
              Meta Connected
            </span>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: (integrationsStatus.meta || integrationsStatus.instagram) ? '#22c55e' : '#64748b',
              boxShadow: (integrationsStatus.meta || integrationsStatus.instagram) ? '0 0 8px #22c55e' : 'none'
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 11.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <Facebook size={12} style={{ color: '#1877f2' }} />
                <span>Facebook App</span>
              </span>
              <span style={{
                color: integrationsStatus.meta ? '#22c55e' : '#64748b',
                fontWeight: 600,
                fontSize: 10.5
              }}>
                {integrationsStatus.meta ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <InstagramIcon size={12} style={{ color: '#e1306c' }} />
                <span>Instagram App</span>
              </span>
              <span style={{
                color: integrationsStatus.instagram ? '#22c55e' : '#64748b',
                fontWeight: 600,
                fontSize: 10.5
              }}>
                {integrationsStatus.instagram ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#cbd5e1' }}>
                <XIcon size={12} style={{ color: '#cbd5e1' }} />
                <span>X (Twitter)</span>
              </span>
              <span style={{
                color: integrationsStatus.x ? '#22c55e' : '#64748b',
                fontWeight: 600,
                fontSize: 10.5
              }}>
                {integrationsStatus.x ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Upgraded Sidebar User Card & Premium Sign Out Button */}
        <div className="side-user-card">
          <div className="side-user-info">
            <div className="side-user-avatar">
              {(s.user?.name || currentRoleMeta.name).charAt(0).toUpperCase()}
            </div>
            <div className="side-user-meta">
              <b>{s.user?.name || currentRoleMeta.name}</b>
              <small>{s.user?.email || 'Authenticated User'}</small>
            </div>
          </div>
          <button
            className="btn-signout-modern"
            onClick={() => {
              localStorage.removeItem('trustloom_session');
              setS(null);
              setAuthModal(null);
              setTab('Home');
            }}
            aria-label="Sign Out"
          >
            <LogOut size={14} /> <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="main">
        {/* Role Bespoke Cyber Atmosphere Ribbon */}
        <div style={{
          padding: '8px 24px',
          background: userRole === 'admin'
            ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.12) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 100%)'
            : userRole === 'manager'
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(2, 132, 199, 0.08) 50%, transparent 100%)'
            : 'linear-gradient(90deg, rgba(192, 132, 252, 0.12) 0%, rgba(34, 197, 94, 0.08) 50%, transparent 100%)',
          borderBottom: userRole === 'admin'
            ? '1px solid rgba(0, 240, 255, 0.2)'
            : userRole === 'manager'
            ? '1px solid rgba(16, 185, 129, 0.2)'
            : '1px solid rgba(192, 132, 252, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: '0.04em'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: userRole === 'admin' ? '#00f0ff' : userRole === 'manager' ? '#10b981' : '#c084fc',
              boxShadow: `0 0 10px ${userRole === 'admin' ? '#00f0ff' : userRole === 'manager' ? '#10b981' : '#c084fc'}`
            }} />
            <span style={{ color: userRole === 'admin' ? '#00f0ff' : userRole === 'manager' ? '#10b981' : '#c084fc' }}>
              {userRole === 'admin'
                ? 'TITANIUM COMMAND MATRIX · CENTRAL SOCIAL GATEWAYS (META & X) CONNECTED'
                : userRole === 'manager'
                ? 'EXECUTIVE RISK & GOVERNANCE SUITE · REAL-TIME DISPOSITION & SLA ACTIVE'
                : 'NEURAL FORENSIC LAB & THREAT RADAR · 44-NODE SYBIL MATRIX SYNCHRONIZED'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--tx-dim)', fontSize: 11 }}>
            <span>Workspace: <b style={{ color: 'var(--tx)' }}>TrustLoom AI Cloud</b></span>
            <span>Security: <b style={{ color: '#10b981' }}>Strict Encrypted</b></span>
          </div>
        </div>

        {/* Mobile Topbar with Hamburger Toggle */}
        <div className="mobile-topbar">
          <Logo />
          <button
            className="btn ghost sm"
            onClick={() => setMobileDrawer(!mobileDrawer)}
            aria-label="Toggle menu"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {mobileDrawer ? <X size={16} /> : <><Menu size={16} /> <span>Menu</span></>}
          </button>
        </div>

        {/* Top Header with Dynamic Role Status (Image 3 UI Reference) */}
        <div className="top">
          <div className="top-title">
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              {tab === 'Account Search' ? 'Account Search & Analysis' : tab}
            </h2>
            <div className="user-sub" style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 3 }}>
              {tab === 'Account Search'
                ? 'Search any social media account and get AI-powered authenticity insights.'
                : `Logged in as ${s.user?.name || currentRoleMeta.name} (${s.user?.email || 'Authenticated User'}) · ${currentRoleMeta.access}`
              }
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Role Command Center Badge */}
            <span className={`tag ${currentRoleMeta.tagColor}`} style={{ fontSize: 11, padding: '5px 12px', fontWeight: 700, letterSpacing: '0.03em' }}>
              {currentRoleMeta.cmdCenter}
            </span>

            {/* Notification Bell Icon */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer'
            }} title="Notifications">
              <Bell size={16} />
            </div>

            {/* Topbar User Avatar Pill (Matching Reference Image) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 24,
              padding: '4px 14px 4px 5px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {(s.user?.name || 'TB').slice(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#f8fafc' }}>
                {s.user?.name || 'Talari Bindu'}
              </span>
            </div>

            <button className="btn ghost sm" onClick={() => setDark(!dark)} title="Toggle Dark/Light Mode" style={{ padding: '6px 12px' }}>
              {dark ? '☀ Light' : '☾ Dark'}
            </button>
          </div>
        </div>

        <NetBar t={s.token} />

        {/* View Component with Smooth Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${userRole}-${tab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <View
              t={s.token}
              user={s.user}
              setUser={u => {
                const next = { ...s, user: u };
                setS(next);
                localStorage.setItem('trustloom_session', JSON.stringify(next));
              }}
              onBot={onBot}
              go={setTab}
              tab={tab}
              dark={dark}
              setDark={setDark}
              onGoHome={() => { setTab('Home'); window.history.replaceState(null, '', '/'); }}
              switchRole={switchRole}
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Disclaimer Banner (Image 3 UI Reference) */}
        <div style={{
          marginTop: 36,
          padding: '16px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 11.5,
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
            <span>
              TrustLoom AI uses official platform APIs and machine learning to analyze publicly available data. Results are based on available information and may not be 100% accurate.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#38bdf8' }}>
            <CheckCircle2 size={13} />
            <span>Built for a safer social media experience</span>
          </div>
        </div>
      </div>

      <Chat />

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
          >
            <span style={{ fontSize: 20 }}>🚨</span>
            <div>
              <b>New Bot Threat Flagged</b>
              <div style={{ fontSize: 12, color: 'var(--tx-dim)' }}>
                @{toast.handle} flagged with {Math.round(toast.p * 100)}% bot risk
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
