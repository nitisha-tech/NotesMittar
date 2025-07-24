<<<<<<< HEAD

// src/components/Profile.jsx
import React from 'react';
import '../style/Sidebar.css';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  if (!user) return null;

  const handleProfileClick = () => {
    window.location.href = '/profile';
    onClose();
  };

  // Generate initials if no avatar
  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="sidebar-user-info">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-avatar-placeholder">
              {getInitials(user.username)}
            </div>
          )}
          <div className="sidebar-user-details">
            <h4>{user.username}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-buttons">
            <button className="sidebar-btn profile-btn" onClick={handleProfileClick}>
              <div className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span>Profile</span>
            </button>
            
            <button className="sidebar-btn logout-btn" onClick={onLogout}>
              <div className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
=======

// src/components/Profile.jsx
import React from 'react';
import '../style/Sidebar.css';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  if (!user) return null;

  const handleProfileClick = () => {
    window.location.href = '/profile';
    onClose();
  };

  // Generate initials if no avatar
  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="sidebar-user-info">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="sidebar-user-avatar"
            />
          ) : (
            <div className="sidebar-user-avatar-placeholder">
              {getInitials(user.username)}
            </div>
          )}
          <div className="sidebar-user-details">
            <h4>{user.username}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-buttons">
            <button className="sidebar-btn profile-btn" onClick={handleProfileClick}>
              <div className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span>Profile</span>
            </button>
            
            <button className="sidebar-btn logout-btn" onClick={onLogout}>
              <div className="btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
