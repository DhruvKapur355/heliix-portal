import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onLogin: (email: string, password: string) => string | null;
  onSignup: (email: string, password: string, name: string) => string | null;
}

type Mode = 'login' | 'signup';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function AuthPage({ onLogin, onSignup }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
  }

  function validate(): string | null {
    if (!email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (!password) return 'Password is required.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (mode === 'signup') {
      if (!name.trim()) return 'Full name is required.';
      if (password !== confirm) return 'Passwords do not match.';
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 480));

    const err = mode === 'login'
      ? onLogin(email, password)
      : onSignup(email, password, name.trim());

    setLoading(false);
    if (err) setError(err);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#FAFAF8',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Left panel */}
      <div style={{
        width: '45%',
        minHeight: '100vh',
        background: '#1B3A6B',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Glow circles */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '80px', left: '-60px',
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(42,79,143,0.5) 0%, transparent 70%)',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, background: 'rgba(255,255,255,0.12)',
            borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3.5 3.5l2 2M10.5 10.5l2 2M10.5 3.5l-2 2M5.5 10.5l-2 2" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 600, color: 'white', letterSpacing: '-0.3px' }}>
            Heliix
          </span>
        </div>

        {/* Center illustration + copy */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
          {/* Drone SVG illustration */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Flight path arc */}
              <path d="M20 140 Q110 40 200 100" stroke="rgba(245,166,35,0.3)" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
              {/* Waypoint dots */}
              <circle cx="20" cy="140" r="4" fill="rgba(245,166,35,0.5)" />
              <circle cx="110" cy="65" r="3" fill="rgba(245,166,35,0.35)" />
              <circle cx="200" cy="100" r="4" fill="rgba(245,166,35,0.5)" />
              {/* Drone body */}
              <g transform="translate(90, 50)">
                <rect x="-14" y="-6" width="28" height="12" rx="4" fill="white" fillOpacity="0.92" />
                <rect x="-10" y="-3" width="20" height="6" rx="2" fill="#1B3A6B" />
                {/* Rotor arms */}
                <line x1="-14" y1="-4" x2="-26" y2="-14" stroke="white" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
                <line x1="14" y1="-4" x2="26" y2="-14" stroke="white" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
                <line x1="-14" y1="4" x2="-26" y2="14" stroke="white" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
                <line x1="14" y1="4" x2="26" y2="14" stroke="white" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
                {/* Rotors */}
                <ellipse cx="-26" cy="-14" rx="10" ry="3" fill="white" fillOpacity="0.25" />
                <ellipse cx="26" cy="-14" rx="10" ry="3" fill="white" fillOpacity="0.25" />
                <ellipse cx="-26" cy="14" rx="10" ry="3" fill="white" fillOpacity="0.25" />
                <ellipse cx="26" cy="14" rx="10" ry="3" fill="white" fillOpacity="0.25" />
                {/* Camera */}
                <circle cx="0" cy="10" r="4" fill="rgba(245,166,35,0.9)" />
                <circle cx="0" cy="10" r="2" fill="#1B3A6B" />
                {/* Signal rings */}
                <circle cx="0" cy="0" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
                <circle cx="0" cy="0" r="55" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none" />
              </g>
              {/* Floor plan outline */}
              <rect x="30" y="100" width="160" height="50" rx="4" stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="rgba(255,255,255,0.03)" />
              <line x1="90" y1="100" x2="90" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="150" y1="100" x2="150" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="30" y1="125" x2="90" y2="125" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </svg>
          </div>

          <div>
            <h1 style={{
              fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 32,
              color: 'white', lineHeight: 1.25, marginBottom: 14, letterSpacing: '-0.5px',
            }}>
              Autonomous Drone<br />Inspection Portal
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 340 }}>
              Real-time mission control, intelligent inspection media, and AI-generated property reports — all in one secure workspace.
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '⬡', label: 'Live drone telemetry & mission control' },
              { icon: '◈', label: 'Automated room-by-room media capture' },
              { icon: '◎', label: 'AI inspection reports & condition scoring' },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#F5A623',
                }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1px' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2025 Heliix Technologies. All rights reserved.
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 600,
              color: '#1A1A1A', marginBottom: 8, letterSpacing: '-0.4px',
            }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ fontSize: 14, color: '#6B6B65', lineHeight: 1.5 }}>
              {mode === 'login'
                ? 'Sign in to access your drone portal.'
                : 'Set up your Heliix account to get started.'}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: '#F0F0EC', borderRadius: 10,
            padding: 4, marginBottom: 32, gap: 4,
          }}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: '9px 0', border: 'none', borderRadius: 7, cursor: 'pointer',
                  fontSize: 13, fontWeight: mode === m ? 600 : 400,
                  color: mode === m ? '#1A1A1A' : '#6B6B65',
                  background: mode === m ? '#FFFFFF' : 'transparent',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.18s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, inputStyle)}
                autoComplete="email"
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputFocusStyle, paddingRight: '44px' })}
                  onBlur={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, paddingRight: '44px' })}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9B9B93', padding: 2, display: 'flex', alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 44 }}
                    onFocus={(e) => Object.assign(e.currentTarget.style, { ...inputFocusStyle, paddingRight: '44px' })}
                    onBlur={(e) => Object.assign(e.currentTarget.style, { ...inputStyle, paddingRight: '44px' })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9B9B93', padding: 2, display: 'flex', alignItems: 'center',
                    }}
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: '#FDECEA', border: '1px solid rgba(192,57,43,0.2)',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: '#C0392B', lineHeight: 1.4,
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: '100%', padding: '13px 0',
                background: loading ? '#4a6a9e' : '#1B3A6B',
                color: 'white', border: 'none', borderRadius: 10,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'background 0.18s, transform 0.1s',
                letterSpacing: '0.1px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#2a4f8f'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#1B3A6B'; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.7s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : (
                mode === 'login' ? 'Sign In to Portal' : 'Create Account'
              )}
            </button>
          </form>

          {/* Switch mode link */}
          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#6B6B65' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#1B3A6B', fontWeight: 600, fontSize: 13,
                fontFamily: 'DM Sans, sans-serif', padding: 0,
                textDecoration: 'underline', textUnderlineOffset: 2,
              }}
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: '#1A1A1A', marginBottom: 6, fontFamily: 'DM Sans, sans-serif',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1.5px solid #E8E8E4', borderRadius: 10,
  fontSize: 14, color: '#1A1A1A', background: '#FFFFFF',
  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box',
};

const inputFocusStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: '#1B3A6B',
  boxShadow: '0 0 0 3px rgba(27,58,107,0.1)',
};
