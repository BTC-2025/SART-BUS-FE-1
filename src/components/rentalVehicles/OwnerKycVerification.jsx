import React, { useState } from 'react';
import './rentalVehicles.css';

export default function OwnerKycVerification({ owner, onKycSubmitted, onAdminApprove }) {
  const [kycDocs, setKycDocs] = useState({
    idFront: { name: 'Aadhaar_Front_Signed.pdf', status: 'Uploaded', verified: false, date: 'Today' },
    idBack: { name: 'Aadhaar_Back_Signed.pdf', status: 'Uploaded', verified: false, date: 'Today' },
    panCard: { name: 'PAN_Card_Scanned.pdf', status: 'Uploaded', verified: false, date: 'Today' },
    upiProof: { name: 'UPI_Account_QR_Statement.pdf', status: 'Uploaded', verified: false, date: 'Today' },
    gstCertificate: { name: 'GST_Registration_Certificate.pdf', status: 'Uploaded', verified: false, date: 'Today' },
    rentAgreement: { name: 'Rental_Operator_Agreement.pdf', status: 'Uploaded', verified: false, date: 'Today' }
  });

  const [isAdminView, setIsAdminView] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [kycStatus, setKycStatus] = useState(owner?.kycStatus || 'Pending Admin Verification');

  const handleAdminDecision = (status) => {
    setKycStatus(status);
    if (onAdminApprove) {
      onAdminApprove(status);
    }
  };

  const isApproved = kycStatus === 'Approved';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: '#eff6ff',
              color: '#2563eb',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              Step 2 & 3
            </span>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Owner Identity & Admin Verification</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
            KYC Document Upload & Admin Review
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' }}>
            The host cannot publish or list vehicles until owner KYC documents are reviewed and approved.
          </p>
        </div>

        {/* Toggle Admin Simulator */}
        <button
          type="button"
          onClick={() => setIsAdminView(!isAdminView)}
          className="rental-btn-secondary"
          style={{ fontSize: '13px', borderColor: '#93c5fd', background: isAdminView ? '#eff6ff' : '#ffffff' }}
        >
          <i className="fa-solid fa-user-shield" style={{ color: '#2563eb' }}></i>
          {isAdminView ? 'Switch to Owner View' : 'Admin Verification Console'}
        </button>
      </div>

      {/* Verification Status Banner */}
      <div style={{
        background: isApproved ? '#ecfdf5' : kycStatus === 'Rejected' ? '#fef2f2' : '#fffbeb',
        border: `1px solid ${isApproved ? '#a7f3d0' : kycStatus === 'Rejected' ? '#fecaca' : '#fde68a'}`,
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: isApproved ? '#10b981' : kycStatus === 'Rejected' ? '#ef4444' : '#f59e0b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <i className={`fa-solid ${isApproved ? 'fa-check-double' : kycStatus === 'Rejected' ? 'fa-ban' : 'fa-hourglass-half'}`}></i>
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>
              Host KYC Status: <span style={{ color: isApproved ? '#059669' : kycStatus === 'Rejected' ? '#dc2626' : '#d97706' }}>{kycStatus}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Owner: <strong>{owner?.fullName || 'Ramesh Sundaram'}</strong> ({owner?.ownerType || 'Individual'}) • ID: {owner?.idNumber || '4821-9912-3840'}
            </div>
          </div>
        </div>

        {isAdminView && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleAdminDecision('Approved')}
              className="rental-btn-success"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              <i className="fa-solid fa-check"></i> Approve Host KYC
            </button>
            <button
              onClick={() => handleAdminDecision('Rejected')}
              className="rental-btn-danger"
            >
              <i className="fa-solid fa-xmark"></i> Reject
            </button>
          </div>
        )}
      </div>

      {/* KYC Documents Checklist */}
      <div className="rental-form-card">
        <div className="rental-section-header">
          <h3>Submitted Identification & Financial Documents</h3>
          <p>Official records matching Indian KYC requirements for commercial self-drive vehicle hosts</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { key: 'idFront', title: 'Aadhaar / PAN Card (Front Side)', desc: 'Official Photo and DOB matching owner profile', icon: 'fa-id-card' },
            { key: 'idBack', title: 'Aadhaar or PAN Card (Back Side)', desc: 'Official permanent address verification', icon: 'fa-address-card' },
            { key: 'panCard', title: 'PAN Card', desc: 'Mandatory for tax deduction and bank linking', icon: 'fa-file-invoice' },
            { key: 'upiProof', title: 'UPI ID & VPA Verification Proof', desc: 'Verifies active UPI handle for instant rental earnings credit', icon: 'fa-qrcode' },
            { key: 'gstCertificate', title: 'GST Registration Certificate', desc: 'Required for commercial fleet owners and rental agencies', icon: 'fa-certificate' },
            { key: 'rentAgreement', title: 'Host Platform Terms & Self-Drive Agreement', desc: 'Digital signature consent to vehicle rental terms', icon: 'fa-signature' }
          ].map((doc) => {
            const uploaded = kycDocs[doc.key];
            return (
              <div
                key={doc.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    <i className={`fa-solid ${doc.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{doc.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.desc}</div>
                    <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '2px', fontWeight: '600' }}>
                      <i className="fa-solid fa-paperclip"></i> {uploaded.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`rental-status-pill ${isApproved ? 'rental-status-approved' : 'rental-status-pending'}`}>
                    <i className={`fa-solid ${isApproved ? 'fa-check' : 'fa-clock'}`}></i>
                    {isApproved ? 'Verified by Admin' : 'Pending Verification'}
                  </span>
                  <button
                    type="button"
                    style={{
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                    onClick={() => alert(`Previewing ${uploaded.name}`)}
                  >
                    View File
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lock Notice if not approved */}
      {!isApproved && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <i className="fa-solid fa-lock" style={{ color: '#d97706', fontSize: '20px' }}></i>
          <div style={{ fontSize: '13.5px', color: '#92400e', lineHeight: '1.5' }}>
            <strong>Upload Locked:</strong> In accordance with rental host compliance, you cannot publish rental vehicles until Admin finishes Step 3 KYC verification. Click <em>"Admin Verification Console"</em> above to simulate instant approval.
          </div>
        </div>
      )}

      {/* Navigation action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => onKycSubmitted && onKycSubmitted('register')}
          className="rental-btn-secondary"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Owner Details
        </button>

        {isApproved && (
          <button
            type="button"
            onClick={() => onKycSubmitted && onKycSubmitted('add_vehicle')}
            className="rental-btn-primary"
            style={{ padding: '12px 28px', fontSize: '15px' }}
          >
            <i className="fa-solid fa-car-side"></i>
            Proceed to Add Vehicle (Step 4)
          </button>
        )}
      </div>
    </div>
  );
}
