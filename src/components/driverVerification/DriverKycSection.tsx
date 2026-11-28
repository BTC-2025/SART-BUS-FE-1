'use client';

import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

interface DriverKycSectionProps {
  dlNumber: string;
  setDlNumber: (val: string) => void;
  dlUploadName: string;
  setDlUploadName: (name: string) => void;
  aadhaarNumber: string;
  setAadhaarNumber: (val: string) => void;
  aadhaarUploadName: string;
  setAadhaarUploadName: (name: string) => void;
  panNumber: string;
  setPanNumber: (val: string) => void;
  panUploadName: string;
  setPanUploadName: (name: string) => void;
  pccUploadName: string;
  setPccUploadName: (name: string) => void;
  emergencyContact: string;
  setEmergencyContact: (val: string) => void;
  handleDocumentSelect: (setter: (name: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DriverKycSection({
  dlNumber,
  setDlNumber,
  dlUploadName,
  setDlUploadName,
  aadhaarNumber,
  setAadhaarNumber,
  aadhaarUploadName,
  setAadhaarUploadName,
  panNumber,
  setPanNumber,
  panUploadName,
  setPanUploadName,
  pccUploadName,
  setPccUploadName,
  emergencyContact,
  setEmergencyContact,
  handleDocumentSelect
}: DriverKycSectionProps) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>
        Government ID &amp; Verifications (KYC)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* DL + Aadhaar + PAN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {/* Driving License */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Driving License (DL) Number <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                placeholder="Enter DL number"
                style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                required
              />
              <label style={{
                padding: '8px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: '#f8fafc',
                fontSize: '11.5px',
                fontWeight: 700,
                color: dlUploadName ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}>
                <FileText style={{ width: '13px', height: '13px', color: dlUploadName ? '#ef4444' : '#94a3b8' }} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dlUploadName || 'Upload DL'}</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleDocumentSelect(setDlUploadName)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {dlNumber && (
              <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', display: 'block' }}>Valid Till: 2032</span>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Aadhaar Card Number <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="Enter 12-digit Aadhaar"
                style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                required
              />
              <label style={{
                padding: '8px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: '#f8fafc',
                fontSize: '11.5px',
                fontWeight: 700,
                color: aadhaarUploadName ? '#059669' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}>
                <CheckCircle2 style={{ width: '13px', height: '13px', color: aadhaarUploadName ? '#10b981' : '#94a3b8' }} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{aadhaarUploadName || 'Upload Aadhaar'}</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleDocumentSelect(setAadhaarUploadName)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* PAN Card */}
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              PAN Card Number <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="Enter 10-digit PAN"
                style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
                required
              />
              <label style={{
                padding: '8px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: '#f8fafc',
                fontSize: '11.5px',
                fontWeight: 700,
                color: panUploadName ? '#059669' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}>
                <CheckCircle2 style={{ width: '13px', height: '13px', color: panUploadName ? '#10b981' : '#94a3b8' }} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{panUploadName || 'Upload PAN'}</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleDocumentSelect(setPanUploadName)}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* PCC & Emergency Contact */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Police Clearance Certificate / Criminal Record Check
            </label>
            <label style={{
              padding: '9px 12px',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              background: '#f8fafc',
              fontSize: '12px',
              fontWeight: 600,
              color: pccUploadName ? '#334155' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FileText style={{ width: '15px', height: '15px', color: pccUploadName ? '#ef4444' : '#94a3b8' }} />
              <span>{pccUploadName || 'Upload PCC Document (.pdf)'}</span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleDocumentSelect(setPccUploadName)}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
              Emergency Contact Name &amp; Relation
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="e.g. Suresh Kumar (Brother) - 98765 43211"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
