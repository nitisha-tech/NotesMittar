
// src/components/Profile.jsx
import React, { useState } from 'react';
import '../style/Profile.css';

export default function Profile({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const [contact, setContact] = useState(user.contact || '');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const toggleProfile = () => setShowProfile(!showProfile);

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('Passwords do not match');
      return;
    }

    if (passwordData.new.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          username: user.username
        },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });

      const data = await res.json();
      alert(data.message || data.error);
      if (res.ok) {
        setShowChangePassword(false);
        setPasswordData({ current: '', new: '', confirm: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Error changing password');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          username: user.username
        },
        body: JSON.stringify({ contact })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  return (
    <>
      <div className="profile-icon" onClick={toggleProfile}>
        <span className="profile-icon-circle">👤</span>
      </div>

      {showProfile && (
        <>
          <div className="profile-overlay" onClick={toggleProfile}></div>
          <div className="profile-sidebar">
            <div className="profile-header">
              <button className="close-profile" onClick={toggleProfile}>×</button>
              <h3 onClick={() => window.location.href = `/leaderboard#${user.username}`}>
                {user.username}
              </h3>
              <p>{user.email}</p>
              {/* ✅ Add Upload Count */}
              <p>📁 Uploads: <strong>{user.uploadCount || 0}</strong></p>

              <input
                type="text"
                value={contact}
                placeholder="Contact (optional)"
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="profile-actions">
              <button onClick={handleSaveProfile} className="save-profile-btn">
                Save Profile
              </button>
              
              <button onClick={() => setShowChangePassword(!showChangePassword)}>
                {showChangePassword ? 'Cancel Password Change' : 'Change Password'}
              </button>

              {showChangePassword && (
                <div className="password-box">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  />
                  <button onClick={handlePasswordChange}>Submit</button>
                </div>
              )}

              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
