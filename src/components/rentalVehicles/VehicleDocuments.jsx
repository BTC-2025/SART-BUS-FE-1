import React, { useState } from 'react';
import './rentalVehicles.css';

export default function VehicleDocuments({ documents, onChange, onAdminStatusChange, isAdmin = false }) {
  const docList = [
    {
      id: 'rc',
      title: 'Registration Certificate (RC)',
      purpose: 'Verify vehicle ownership and commercial registration',
      mandatory: true,
      exampleFile: 'RC_AP_09_BK_4421.pdf',
      legalNote: 'Must verify whether vehicle is private or authorized for self-drive/taxi rental'
    },
    {
      id: 'insurance',
      title: 'Commercial / Rental Insurance Certificate',
      purpose: 'Verify valid active comprehensive third-party & passenger insurance',
      mandatory: true,
      exampleFile: 'Comprehensive_Insurance_Policy.pdf',
      legalNote: 'Must cover self-drive rental liability for customer damages'
    },
    {
      id: 'fitness',
      title: 'Vehicle Fitness Certificate (Form 38)',
      purpose: 'Required for commercial and transport vehicles',
      mandatory: false,
      exampleFile: 'RTO_Fitness_Certificate.pdf',
      legalNote: 'Ensures roadworthiness and mechanical safety'
    },
    {
      id: 'permit',
      title: 'Rent-a-Cab / All India Tourist Permit',
      purpose: 'Verify authorization for inter-state & commercial rental',
      mandatory: false,
      exampleFile: 'All_India_Tourist_Permit.pdf',
      legalNote: 'A private white-plate vehicle cannot be listed without valid rental authorization'
    },
    {
      id: 'puc',
      title: 'Pollution Under Control (PUC)',
      purpose: 'Verify applicable vehicular emission standards compliance',
      mandatory: true,
      exampleFile: 'PUC_Test_Receipt.pdf',
      legalNote: 'Must be valid within statutory 6 or 12 month cycle'
    },
    {
      id: 'tax',
      title: 'Road Tax & State Tax Documents',
      purpose: 'Receipt confirming updated road tax payment',
      mandatory: false,
      exampleFile: 'Motor_Vehicle_Tax_Token.pdf',
      legalNote: 'Required to prevent detention at RTO checkposts'
    },
    {
      id: 'commercialReg',
      title: 'Commercial Yellow Plate Registration',
      purpose: 'Mandatory where rental law enforces yellow-on-black or yellow plates',
      mandatory: false,
      exampleFile: 'Commercial_Registration_Endorsement.pdf',
      legalNote: 'Indian law forbids leasing private-use white plate cars without rent-a-cab scheme compliance'
    },
    {
      id: 'authorization',
      title: 'Owner Authorization / Lease Agreement',
      purpose: 'If uploader is not the direct registered owner on the RC',
      mandatory: false,
      exampleFile: 'Power_Of_Attorney_Lease.pdf',
      legalNote: 'Required for fleet aggregators, hosts, and managers subleasing vehicles'
    }
  ];

  return (
    <div className="rental-form-card">
      <div className="rental-section-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3>4. Vehicle Documents & Legal Compliance</h3>
            <p>Documents required to prove ownership, roadworthiness, and rental legitimacy</p>
          </div>
          <span style={{
            background: '#ecfdf5',
            color: '#065f46',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '700',
            border: '1px solid #a7f3d0'
          }}>
            India Motor Vehicles Act Compliance
          </span>
        </div>
      </div>

      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#1e40af',
        lineHeight: '1.5'
      }}>
        <strong>Legal Compliance Rule:</strong> For a legitimate rental marketplace in India, verify that the vehicle is legally eligible for self-drive or commercial hire. Private-use vehicles cannot automatically be listed without valid Rent-a-Cab authorization.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {docList.map((doc) => {
          const docState = documents[doc.id] || {
            uploaded: false,
            fileName: '',
            status: 'Pending Verification', // 'Pending Verification' | 'Approved' | 'Rejected' | 'Expired'
            expiryDate: '2026-12-31'
          };

          return (
            <div
              key={doc.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '16px 20px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: docState.uploaded ? '#ecfdf5' : '#f1f5f9',
                    color: docState.uploaded ? '#059669' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    <i className={`fa-solid ${docState.uploaded ? 'fa-file-circle-check' : 'fa-file-arrow-up'}`}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                      {doc.title} {doc.mandatory && <span style={{ color: '#ef4444' }}>*</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.purpose}</div>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className={`rental-status-pill ${
                    docState.status === 'Approved' ? 'rental-status-approved' :
                    docState.status === 'Rejected' ? 'rental-status-rejected' :
                    docState.status === 'Expired' ? 'rental-status-rejected' : 'rental-status-pending'
                  }`}>
                    <i className={`fa-solid ${
                      docState.status === 'Approved' ? 'fa-circle-check' :
                      docState.status === 'Rejected' ? 'fa-circle-xmark' :
                      docState.status === 'Expired' ? 'fa-triangle-exclamation' : 'fa-hourglass-half'
                    }`}></i>
                    {docState.status}
                  </span>

                  {/* Upload Simulator */}
                  {!docState.uploaded ? (
                    <button
                      type="button"
                      className="rental-btn-secondary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => {
                        onChange(doc.id, {
                          uploaded: true,
                          fileName: doc.exampleFile,
                          status: 'Pending Verification',
                          expiryDate: '2026-12-31'
                        });
                      }}
                    >
                      <i className="fa-solid fa-upload"></i> Upload
                    </button>
                  ) : (
                    <button
                      type="button"
                      style={{
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        color: '#0f172a'
                      }}
                      onClick={() => alert(`Viewing document: ${docState.fileName}`)}
                    >
                      <i className="fa-solid fa-eye"></i> View
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-info bar: Filename & Admin reviewer buttons */}
              {docState.uploaded && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px dashed #f1f5f9',
                  fontSize: '12px',
                  color: '#64748b',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div>
                    <span style={{ color: '#2563eb', fontWeight: '600' }}>
                      <i className="fa-solid fa-paperclip"></i> {docState.fileName}
                    </span>
                    <span style={{ marginLeft: '12px' }}>
                      Valid Till: <strong>{docState.expiryDate}</strong>
                    </span>
                  </div>

                  {/* Admin controls for setting status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>Admin Status:</span>
                    {['Approved', 'Pending Verification', 'Rejected', 'Expired'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => onAdminStatusChange && onAdminStatusChange(doc.id, st)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: docState.status === st ? '1px solid #2563eb' : '1px solid #e2e8f0',
                          background: docState.status === st ? '#eff6ff' : '#ffffff',
                          color: docState.status === st ? '#2563eb' : '#64748b',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
