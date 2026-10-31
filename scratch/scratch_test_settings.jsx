
import React, { useState, useEffect } from 'd:/TrustLoom_AI_Complete_Upgrade_Fixed/client/node_modules/react';
import ReactDOMServer from 'd:/TrustLoom_AI_Complete_Upgrade_Fixed/client/node_modules/react-dom/server';

const api = () => Promise.resolve({});
const MetaIcon = () => 'MetaIcon';
const InstagramIcon = () => 'InstagramIcon';
const XIcon = () => 'XIcon';
const Tgl = () => 'Tgl';

function Settings({ t, user, setUser, tab = 'Settings', dark, setDark, switchRole, go }) {
  const [n, setN] = useState(user?.name || '');
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

  const metaRedirectUri = tunnelInfo?.metaRedirectUri || `http://localhost:5050/api/integrations/meta/callback`;
  const igRedirectUri = tunnelInfo?.instagramRedirectUri || `http://localhost:5050/api/integrations/instagram/callback`;
  const xRedirectUri = tunnelInfo?.xRedirectUri || `http://localhost:5050/api/integrations/x/callback`;

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
              Current Active Role: <b style={{ color: '#00f0ff' }}>{(user.role || 'admin').toUpperCase()}</b> · Logged in as <b>{user.name}</b> ({user.email})
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
                className={`btn sm ${user.role === r.id ? '' : 'ghost'}`}
                style={user.role === r.id ? { background: '#00f0ff', color: '#000', fontWeight: 700 } : {}}
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
      {user.role === 'admin' ? (
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
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn sm ghost"
                onClick={resetRedirectToLocalhost}
                disabled={savingTunnel}
                title="Reset callback URIs to http://localhost:5050"
              >
                Reset Callbacks to Localhost Mode
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
      ) : user.role === 'manager' ? (
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
              Pair your phone Google Authenticator, Microsoft Authenticator, or 2FAS with <b>{user.email}</b>
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
}

/* =========================================================================
   PLANS & SUBSCRIPTION MANAGEMENT (Fast-Track Unlock + UPI Payment)
   ========================================================================= */


console.log('Settings is:', typeof Settings);
console.log('Settings toString length:', Settings.toString().length);
try {
  const el = Settings({
    t: 'test-token',
    user: { id: '1', role: 'analyst', name: 'Security Analyst', email: 'analyst@demo.com', plan: 'free' },
    setUser: () => {},
    dark: true,
    setDark: () => {},
    switchRole: () => {},
    go: () => {}
  });
  console.log('Direct call return value:', el);
} catch (e) {
  console.log('Direct call error:', e);
}
