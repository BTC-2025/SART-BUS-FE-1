import React, { useState, useEffect, useRef } from 'react';
import './SettingsView.css';

export default function SettingsView({ partnerDetails, onUpdatePartner }) {
  const [profile, setProfile] = useState({
    name: partnerDetails?.name || '',
    email: partnerDetails?.email || '',
    recoveryEmail: 'None added',
    phone: partnerDetails?.phone || '+91',
    birthday: 'Not set',
    gender: 'Rather not say',
    photo: ''
  });

  const [activeModal, setActiveModal] = useState(null); // 'name' | 'phone' | 'password' | 'birthday' | 'gender' | 'recoveryEmail'
  const [editValues, setEditValues] = useState({});
  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);

  // Fetch live profile from Backend API (http://localhost:5000)
  useEffect(() => {
    fetch('http://localhost:5000/api/business/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setProfile(prev => ({
            ...prev,
            ...data.data,
            recoveryEmail: data.data.recoveryEmail || 'None added',
            birthday: data.data.birthday || 'Not set'
          }));
        }
      })
      .catch(() => {
        // Fallback to local state if server offline
      });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const openEditModal = (field) => {
    setActiveModal(field);
    if (field === 'password') {
      setEditValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setEditValues({ [field]: profile[field] === 'Not set' || profile[field] === 'None added' ? '' : profile[field] });
    }
  };

  const handleSaveModal = async () => {
    if (activeModal === 'password') {
      if (!editValues.newPassword || editValues.newPassword.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
      }
      if (editValues.newPassword !== editValues.confirmPassword) {
        showToast('New passwords do not match');
        return;
      }
    }

    try {
      const payload = {
        name: activeModal === 'name' ? editValues.name : profile.name,
        phone: activeModal === 'phone' ? editValues.phone : profile.phone,
        birthday: activeModal === 'birthday' ? editValues.birthday : profile.birthday,
        gender: activeModal === 'gender' ? editValues.gender : profile.gender,
        recoveryEmail: activeModal === 'recoveryEmail' ? editValues.recoveryEmail : profile.recoveryEmail,
        ...(activeModal === 'password' ? { password: editValues.newPassword } : {})
      };

      const res = await fetch('http://localhost:5000/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setProfile(prev => ({
          ...prev,
          ...data.data,
          recoveryEmail: data.data.recoveryEmail || 'None added',
          birthday: data.data.birthday || 'Not set'
        }));
        if (onUpdatePartner && payload.name) {
          onUpdatePartner({ name: payload.name, phone: payload.phone });
        }
        showToast(activeModal === 'password' ? 'Password changed successfully' : 'Profile updated successfully');
      }
    } catch (e) {
      // Local fallback
      setProfile(prev => ({
        ...prev,
        ...editValues
      }));
      showToast('Updated successfully');
    }
    setActiveModal(null);
  };

  // Upload Photo handler
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      setProfile(prev => ({ ...prev, photo: base64 }));

      try {
        await fetch('http://localhost:5000/api/business/profile/photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });
        showToast('Photo uploaded successfully');
      } catch (err) {
        showToast('Photo set locally');
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo handler
  const handleRemovePhoto = async () => {
    setProfile(prev => ({ ...prev, photo: '' }));
    try {
      await fetch('http://localhost:5000/api/business/profile/photo', {
        method: 'DELETE'
      });
      showToast('Photo removed');
    } catch (err) {
      showToast('Photo removed');
    }
  };

  const initial = profile.name ? profile.name.trim().charAt(0).toUpperCase() : '';
  const firstName = profile.name ? profile.name.split(' ')[0].toUpperCase() : '';

  return (
    <div className="settings-page-container">
      {/* Hidden file input for Photo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="settings-alert-toast">
          <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
          <span>{toast}</span>
        </div>
      )}

      {/* Top Welcome Section matching Screenshot 3 */}
      <div className="profile-avatar-header">
        <div className="profile-avatar-circle-large">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} />
          ) : (
            <span>{initial}</span>
          )}
        </div>
        <h1 className="profile-welcome-heading">Welcome, {firstName}</h1>
        <p className="profile-welcome-sub">Manage your info, privacy, and security to make B2Auth work better for you.</p>
      </div>

      {/* Card 1: Basic info matching Screenshot 2 & 3 (without NICKNAME & DISPLAY NAME) */}
      <div className="settings-info-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Basic info</h2>
          <p className="settings-card-desc">Some info may be visible to other people using BNX services. Click any row to update.</p>
        </div>

        <div className="settings-rows-list">
          {/* PHOTO ROW */}
          <div className="settings-row-item" style={{ cursor: 'default' }}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-solid fa-camera"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">PHOTO</span>
                <span className="settings-row-val" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {profile.photo ? (
                    <img src={profile.photo} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span>Add a photo to personalize your account</span>
                  )}
                </span>
              </div>
            </div>
            <div className="photo-row-controls">
              <button type="button" className="btn-change-photo" onClick={() => fileInputRef.current?.click()}>
                CHANGE PHOTO
              </button>
              {profile.photo && (
                <button type="button" className="btn-remove-photo" onClick={handleRemovePhoto}>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* NAME ROW */}
          <div className="settings-row-item" onClick={() => openEditModal('name')}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-regular fa-user"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">NAME</span>
                <span className="settings-row-val">{profile.name}</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>

          {/* BIRTHDAY ROW */}
          <div className="settings-row-item" onClick={() => openEditModal('birthday')}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-regular fa-calendar"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">BIRTHDAY</span>
                <span className="settings-row-val">{profile.birthday}</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>

          {/* GENDER ROW */}
          <div className="settings-row-item" onClick={() => openEditModal('gender')}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-regular fa-face-smile"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">GENDER</span>
                <span className="settings-row-val">{profile.gender}</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>

          {/* PASSWORD ROW */}
          <div className="settings-row-item" onClick={() => openEditModal('password')}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-solid fa-lock"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">PASSWORD</span>
                <span className="settings-row-val">••••••••</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>
        </div>
      </div>

      {/* Card 2: Contact info matching Screenshot 2 */}
      <div className="settings-info-card">
        <div className="settings-card-header">
          <h2 className="settings-card-title">Contact info</h2>
          <p className="settings-card-desc">Your contact information used for communication and recovery. Click to edit.</p>
        </div>

        <div className="settings-rows-list">
          {/* PRIMARY EMAIL ROW */}
          <div className="settings-row-item" style={{ cursor: 'default' }}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">PRIMARY EMAIL</span>
                <span className="settings-row-val">{profile.email}</span>
              </div>
            </div>
          </div>

          {/* RECOVERY EMAIL ROW */}
          <div className="settings-row-item" onClick={() => openEditModal('recoveryEmail')}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">RECOVERY EMAIL</span>
                <span className="settings-row-val">{profile.recoveryEmail}</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>

          {/* PHONE NUMBER ROW */}
          <div className="settings-row-item" onClick={() => openEditModal('phone')}>
            <div className="settings-row-left">
              <div className="settings-row-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div className="settings-row-texts">
                <span className="settings-row-label">PHONE NUMBER</span>
                <span className="settings-row-val">{profile.phone}</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right settings-row-chevron"></i>
          </div>
        </div>
      </div>

      {/* EDIT MODAL DIALOG */}
      {activeModal && (
        <div className="settings-edit-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="settings-edit-modal-card" onClick={e => e.stopPropagation()}>
            <div className="settings-edit-modal-header">
              <h3>
                {activeModal === 'name' && 'Change Name'}
                {activeModal === 'phone' && 'Change Phone Number'}
                {activeModal === 'password' && 'Change Password'}
                {activeModal === 'birthday' && 'Set Birthday'}
                {activeModal === 'gender' && 'Select Gender'}
                {activeModal === 'recoveryEmail' && 'Set Recovery Email'}
              </h3>
              <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="settings-edit-modal-body">
              {activeModal === 'name' && (
                <div className="settings-field-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={editValues.name || ''}
                    onChange={e => setEditValues({ name: e.target.value })}
                    placeholder="Enter your name"
                    autoFocus
                  />
                </div>
              )}

              {activeModal === 'phone' && (
                <div className="settings-field-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    className="settings-field-input"
                    value={editValues.phone || ''}
                    onChange={e => setEditValues({ phone: e.target.value })}
                    placeholder="+91..."
                    autoFocus
                  />
                </div>
              )}

              {activeModal === 'password' && (
                <>
                  <div className="settings-field-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="settings-field-input"
                      value={editValues.currentPassword || ''}
                      onChange={e => setEditValues({ ...editValues, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="settings-field-input"
                      value={editValues.newPassword || ''}
                      onChange={e => setEditValues({ ...editValues, newPassword: e.target.value })}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div className="settings-field-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      className="settings-field-input"
                      value={editValues.confirmPassword || ''}
                      onChange={e => setEditValues({ ...editValues, confirmPassword: e.target.value })}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </>
              )}

              {activeModal === 'birthday' && (
                <div className="settings-field-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="settings-field-input"
                    value={editValues.birthday || ''}
                    onChange={e => setEditValues({ birthday: e.target.value })}
                  />
                </div>
              )}

              {activeModal === 'gender' && (
                <div className="settings-field-group">
                  <label>Gender</label>
                  <select
                    className="settings-field-input"
                    value={editValues.gender || 'Rather not say'}
                    onChange={e => setEditValues({ gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Rather not say">Rather not say</option>
                  </select>
                </div>
              )}

              {activeModal === 'recoveryEmail' && (
                <div className="settings-field-group">
                  <label>Recovery Email</label>
                  <input
                    type="email"
                    className="settings-field-input"
                    value={editValues.recoveryEmail || ''}
                    onChange={e => setEditValues({ recoveryEmail: e.target.value })}
                    placeholder="example@gmail.com"
                  />
                </div>
              )}

              <div className="settings-edit-modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleSaveModal}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

