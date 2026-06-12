import React, { useState } from 'react';

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 17, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', marginBottom: 4 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>{description}</p>
    </div>
  );
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start', paddingBottom: 18, borderBottom: '1px solid #E8E8E4' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif', marginBottom: 2 }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      onClick={() => onChange(!checked)}
    >
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: checked ? '#1B3A6B' : '#D0CFC8',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: 'white',
            position: 'absolute',
            top: 2,
            left: checked ? 20 : 2,
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {label && <span style={{ fontSize: 13, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>}
    </div>
  );
}

function SliderField({ value, onChange, min, max, unit }: { value: number; onChange: (v: number) => void; min: number; max: number; unit: string; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, accentColor: '#1B3A6B', cursor: 'pointer' }}
      />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', fontFamily: 'DM Sans, sans-serif', minWidth: 52, textAlign: 'right' }}>
        {value} {unit}
      </span>
    </div>
  );
}

function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...inputStyle,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6B65' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: 32,
        cursor: 'pointer',
      }}
    >
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}

function SegmentedControl({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ display: 'flex', gap: 0, background: '#F5F5F2', borderRadius: 8, padding: 3, border: '1px solid #E8E8E4', width: 'fit-content' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: 'none',
            background: value === opt ? '#FFFFFF' : 'transparent',
            color: value === opt ? '#1A1A1A' : '#9B9B93',
            fontSize: 12,
            fontWeight: value === opt ? 600 : 400,
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            boxShadow: value === opt ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function Settings() {
  const [agentName, setAgentName] = useState('Sarah Chen');
  const [brokerage, setBrokerage] = useState('Summit Realty Group');
  const [license, setLicense] = useState('NJ-2204871');
  const [photoInterval, setPhotoInterval] = useState(5);
  const [sensitivity, setSensitivity] = useState('Medium');
  const [maxAltitude, setMaxAltitude] = useState(3);
  const [brandingEnabled, setBrandingEnabled] = useState(true);
  const [exportFormat, setExportFormat] = useState('PDF');
  const [watermark, setWatermark] = useState(true);
  const [linkExpiry, setLinkExpiry] = useState('7 days');
  const [saved, setSaved] = useState(false);

  const [addressFormat, setAddressFormat] = useState('Street, City, State ZIP');

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, fontFamily: 'Fraunces, serif', color: '#1A1A1A', marginBottom: 4 }}>
          Settings
        </h2>
        <p style={{ fontSize: 13, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
          Manage your agent profile, inspection preferences, and export settings.
        </p>
      </div>

      {/* Property Profile */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 12, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader
          title="Property Profile"
          description="Your agent information used in reports and shared links."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <FormField label="Agent Name" hint="Appears on all exported reports">
            <TextInput value={agentName} onChange={setAgentName} />
          </FormField>
          <FormField label="Brokerage Name">
            <TextInput value={brokerage} onChange={setBrokerage} />
          </FormField>
          <FormField label="License Number" hint="NJ real estate license">
            <TextInput value={license} onChange={setLicense} />
          </FormField>
          <FormField label="Address Format" hint="Default format for property addresses">
            <SelectField
              value={addressFormat}
              onChange={setAddressFormat}
              options={['Street, City, State ZIP', 'Street, City, State', 'Full USPS Format']}
            />
          </FormField>
          <FormField label="Logo" hint="Displayed in report headers and share pages">
            <div
              style={{
                border: '1.5px dashed #D0CFC8',
                borderRadius: 8,
                padding: '20px',
                textAlign: 'center',
                background: '#FAFAF8',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>+</div>
              <div style={{ fontSize: 12, color: '#9B9B93', fontFamily: 'DM Sans, sans-serif' }}>
                Upload logo (PNG or SVG, max 2MB)
              </div>
            </div>
          </FormField>
        </div>
      </div>

      {/* Inspection Preferences */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 12, padding: '22px 24px', marginBottom: 16 }}>
        <SectionHeader
          title="Inspection Preferences"
          description="Configure how the drone captures and flags items during a mission."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <FormField label="Photo Interval" hint="How often the drone captures a photo">
            <SliderField value={photoInterval} onChange={setPhotoInterval} min={1} max={10} unit="sec" />
          </FormField>
          <FormField label="Auto-Flag Sensitivity" hint="How aggressively the AI flags potential issues">
            <SegmentedControl value={sensitivity} onChange={setSensitivity} options={['Low', 'Medium', 'High']} />
          </FormField>
          <FormField label="Max Flight Altitude" hint="Ceiling height limit for the drone">
            <SliderField value={maxAltitude} onChange={setMaxAltitude} min={1} max={6} unit="m" />
          </FormField>
          <FormField label="Default Rooms" hint="Rooms always included in every mission">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Living Room', 'Kitchen', 'Master Bedroom', 'Bedroom 2', 'Bathroom', 'Hallway'].map((r) => (
                <span
                  key={r}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: '#EEF2FA',
                    color: '#1B3A6B',
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    border: '1px solid #C5D4ED',
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      {/* Export & Sharing */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E8E8E4', borderRadius: 12, padding: '22px 24px', marginBottom: 24 }}>
        <SectionHeader
          title="Export & Sharing"
          description="Control how reports are exported and shared with clients."
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <FormField label="Report Branding" hint="Include your logo and name in exported reports">
            <Toggle checked={brandingEnabled} onChange={setBrandingEnabled} label={brandingEnabled ? 'Enabled' : 'Disabled'} />
          </FormField>
          <FormField label="Default Export Format">
            <SegmentedControl value={exportFormat} onChange={setExportFormat} options={['PDF', 'ZIP', 'Both']} />
          </FormField>
          <FormField label="Watermark Photos" hint="Add brokerage watermark to all exported images">
            <Toggle checked={watermark} onChange={setWatermark} label={watermark ? 'Enabled' : 'Disabled'} />
          </FormField>
          <FormField label="Share Link Expiry" hint="How long shared report links remain active">
            <SelectField
              value={linkExpiry}
              onChange={setLinkExpiry}
              options={['24 hours', '7 days', '30 days', 'Never']}
            />
          </FormField>
        </div>
      </div>

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 28px',
            borderRadius: 8,
            border: 'none',
            background: saved ? '#2E7D5B' : '#1B3A6B',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid #E8E8E4',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  color: '#1A1A1A',
  background: '#FAFAF8',
  outline: 'none',
};
