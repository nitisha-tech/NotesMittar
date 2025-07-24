<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { User, Contact, Trophy, Shield, Settings, Lock, Edit3, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/ProfilePage.css'; // Ensure you have this CSS file for styling
const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadCount, setUploadCount] = useState(0);
    const [userRank, setUserRank] = useState(null);
    const [uploadsNeeded, setUploadsNeeded] = useState(null);
    const [aboveUsername, setAboveUsername] = useState(null);

    // Get auth data from sessionStorage

    const username = sessionStorage.getItem('username');

    // User data state
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        fullName: '',
        avatar: '👨‍🎓',
        description: '',
        semester: '',
        branch: '',
        phone: '',
        dateJoined: '',
        rank: 'Bronze Member',
        points: 0,
        isAdmin: false
    });

    // Temporary edit state
    const [editData, setEditData] = useState({ ...userData });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const avatarOptions = [
        '👩‍🎓', '👨‍🎓', '👩‍💻', '👨‍💻', '🧑', '🧑', '🧑', '👩‍🔬'
    ];

    const branches = ['AIML', 'CSE-AI', 'ECE', 'MECHANICAL'];
    const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

    // Fetch user profile data on component mount
    useEffect(() => {
         const fetchUserRank = async () => {
                        try {
                            const res = await fetch(`http://localhost:5000/api/user-rank/${username}`);
                            const data = await res.json();

                            setUploadCount(data.uploadCount);
                            setUserRank(data.rank);
                            setUploadsNeeded(data.uploadsNeededToBeatAbove);
                            setAboveUser(data.aboveUsername);
                        } catch (error) {
                            console.error('Error fetching rank info:', error);
                        }
                    };
        const fetchUserProfile = async () => {
            if (!username) {
                setError('Authentication required');
                return;
            }

            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/user-profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'username': username
                    }
                });
               
                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        username: data.username || username,
                        email: data.email || '',
                        fullName: data.fullName || data.name || '',
                        avatar: data.avatar || '👨‍🎓',
                        description: data.description || '',
                        semester: data.semester || '',
                        branch: data.branch || '',
                        phone: data.phone || '',
                        dateJoined: data.dateJoined || data.createdAt || '',
                        rank: data.rank || 'Bronze Member',
                        points: data.points || 0,
                        isAdmin: data.isAdmin || false
                    });
                    fetchUserRank();


                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch profile data');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    // Update editData when userData changes
    useEffect(() => {
        setEditData({ ...userData });
    }, [userData]);

    // Sidebar navigation items
    const sidebarItems = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'contact', label: 'Contact', icon: Contact },
        { id: 'rank', label: 'Rank & Points', icon: Trophy },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'settings', label: 'Settings', icon: Settings },
        ...(userData.isAdmin ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield }] : [])
    ];

    const handleEdit = () => {
        setEditData({ ...userData });
        setIsEditing(true);
        setError('');
    };

    const handleSave = async () => {
        if (!username) {
            setError('Authentication required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'username': username
                },
                body: JSON.stringify({
                    avatar: editData.avatar,
                    description: editData.description,
                    semester: editData.semester,
                    branch: editData.branch,
                    phone: editData.phone,
                    email: editData.email,
                    fullName: editData.fullName
                })
            });

            if (response.ok) {
                const data = await response.json();
                setUserData({ ...editData });
                setIsEditing(false);
                alert('✅ Profile updated successfully!');

                // Update sessionStorage if avatar changed
                if (data.user?.avatar) {
                    sessionStorage.setItem('avatar', data.user.avatar);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const fetchUserRank = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user-rank/${username}`);
            const data = await res.json();

            setUploadCount(data.uploadCount);
            setUserRank(data.rank);
            setUploadsNeeded(data.uploadsNeededToBeatAbove);
            setAboveUser(data.aboveUsername);
        } catch (error) {
            console.error('Error fetching rank info:', error);
        }
    };


    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
        setError('');
    };

    const handlePasswordChange = async () => {
        if (!username) {
            setError('Authentication required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("New password must be at least 6 characters long!");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'username': username
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                alert('✅ Password changed successfully!');
                setShowPasswordChange(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to change password');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderPersonalInfo = () => (
        <div className="section-content">
            <div className="section-header">
                <h2 className="section-title">Personal Information</h2>
                <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="edit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>⏳ {isEditing ? 'Saving...' : 'Loading...'}</>
                    ) : (
                        <>
                            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                            {isEditing ? 'Save' : 'Edit'}
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="profile-info">
                <div className="avatar-section">
                    <div className="current-avatar">
                        <span style={{ fontSize: '64px' }}>{userData.avatar}</span>
                    </div>
                    {isEditing && (
                        <div className="avatar-grid">
                            {avatarOptions.map((avatar, index) => (
                                <button
                                    key={index}
                                    className={`avatar-option ${editData.avatar === avatar ? 'selected' : ''}`}
                                    onClick={() => setEditData({ ...editData, avatar })}
                                >
                                    <span style={{ fontSize: '24px' }}>{avatar}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.fullName}
                                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                className="input-field"
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <span className="info-value">{userData.fullName || 'Not provided'}</span>
                        )}
                    </div>

                    <div className="info-item">
                        <label>Username</label>
                        <span className="info-value readonly">{userData.username} <small>(Cannot be changed)</small></span>
                    </div>

                    <div className="info-item">
                        <label>Branch</label>
                        {isEditing ? (
                            <select
                                value={editData.branch}
                                onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="info-value">{userData.branch || 'Not selected'}</span>
                        )}
                    </div>

                    <div className="info-item">
                        <label>Semester</label>
                        {isEditing ? (
                            <select
                                value={editData.semester}
                                onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((semester) => (
                                    <option key={semester} value={semester}>{semester}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="info-value">{userData.semester || 'Not selected'}</span>
                        )}
                    </div>

                    <div className="info-item full-width">
                        <label>Description</label>
                        {isEditing ? (
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="input-field"
                                rows={3}
                                placeholder="Tell us something about yourself..."
                            />
                        ) : (
                            <span className="info-value">{userData.description || 'No description provided'}</span>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="edit-actions">
                        <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderContact = () => (
        <div className="section-content">
            <div className="section-header">
                <h2 className="section-title">Contact Information</h2>
                <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="edit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>⏳ {isEditing ? 'Saving...' : 'Loading...'}</>
                    ) : (
                        <>
                            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                            {isEditing ? 'Save' : 'Edit'}
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="info-grid">
                <div className="info-item">
                    <label>Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="input-field"
                            placeholder="Enter your email"
                        />
                    ) : (
                        <span className="info-value">{userData.email || 'Not provided'}</span>
                    )}
                </div>
                <div className="info-item">
                    <label>Phone</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            className="input-field"
                            placeholder="Enter your phone number"
                        />
                    ) : (
                        <span className="info-value">{userData.phone || 'Not provided'}</span>
                    )}
                </div>
                <div className="info-item">
                    <label>Member Since</label>
                    <span className="info-value">
                        {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'Unknown'}
                    </span>
                </div>
            </div>

            {isEditing && (
                <div className="edit-actions">
                    <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );

    const renderRank = () => (
        <div className="section-content">
            <h2 className="section-title">Your Contribution Rank</h2>

            <div className="rank-section">
                <div className="rank-card">
                    <div className="rank-icon">🏆</div>
                    <div className="rank-info">
                        <h3>Rank {userRank ?? '...'}</h3>
                        <p>{uploadCount ?? 0} Uploads</p>
                    </div>
                </div>

                {userRank === 1 ? (
                    <p className="progress-text">
                        🥇 You're already leading! Keep contributing to retain your position.
                    </p>
                ) : (
                    uploadsNeeded !== null && (
                        <p className="progress-text">
                            ⏫ Upload <strong>{uploadsNeeded}</strong> more to surpass the contributor ranked above you.
                        </p>
                    )
                )}
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="section-content">
            <h2 className="section-title">Security Settings</h2>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="security-section">
                <button
                    onClick={() => {
                        setShowPasswordChange(!showPasswordChange);
                        setError('');
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="security-btn"
                    disabled={loading}
                >
                    🔒 {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                </button>

                {showPasswordChange && (
                    <div className="password-form">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="New Password (min 6 characters)"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="input-field"
                        />
                        <div className="password-actions">
                            <button
                                onClick={handlePasswordChange}
                                className="save-btn"
                                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            >
                                {loading ? '⏳ Updating...' : 'Update Password'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordChange(false);
                                    setError('');
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="cancel-btn"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="section-content">
            <h2 className="section-title">Settings</h2>
            <div className="settings-section">
                <div className="setting-item">
                    <label>Email Notifications</label>
                    <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                    <label>Dark Mode</label>
                    <input type="checkbox" />
                </div>
                <div className="setting-item">
                    <label>Privacy Mode</label>
                    <input type="checkbox" />
                </div>
            </div>
        </div>
    );

    const renderAdminDashboard = () => (
    <div className="section-content">
        <h2 className="section-title">Admin Dashboard</h2>
        <div className="admin-section">
            <div className="admin-stats">
                <Link to="/admin/manage-contributors" className="stat-card">
                    <h3>👥 Manage Contributors</h3>
                    <p>View, suspend, or monitor all contributors on the platform.</p>
                </Link>
                
                <Link to="/admin/manage-resources" className="stat-card">
                    <h3>📚 Manage Resources</h3>
                    <p>Approve, reject, or review uploaded study materials.</p>
                </Link>
                
                
            </div>
        </div>
    </div>
);

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return renderPersonalInfo();
            case 'contact':
                return renderContact();
            case 'rank':
                return renderRank();
            case 'security':
                return renderSecurity();
            case 'settings':
                return renderSettings();
            case 'admin':
                return renderAdminDashboard();
            default:
                return renderPersonalInfo();
        }
    };

    return (
        <div className="profile-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="user-preview">
                        <span className="user-avatar">{userData.avatar}</span>
                        <div className="user-info">
                            <h3>{userData.fullName}</h3>
                            <p>@{userData.username}</p>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="main-content">
                {renderContent()}
            </div>

            
        </div>
    );
};

export default ProfilePage;
=======

import React, { useState, useEffect } from 'react';
import '../style/ProfilePage.css';

const avatarOptions = [
  '👩‍🎓', '👨‍🎓', '👩‍💻', '👨‍💻', '🧑‍🔬', '🧑‍🏫', '🧑‍🚀', '👩‍🔬'
];

const branches = ['AIML', 'CSE-AI', 'ECE', 'MECHANICAL'];
const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

const ProfilePage = () => {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  // Optional: fetch existing profile data if you want to pre-fill fields
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'username': username
          }
        });

        if (res.ok) {
          const data = await res.json();
          setSelectedAvatar(data.avatar || '');
          setDescription(data.description || '');
          setSemester(data.semester || '');
          setBranch(data.branch || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (token && username) {
      fetchProfile();
    }
  }, [token, username]);

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'username': username
        },
        body: JSON.stringify({
          avatar: selectedAvatar,
          description,
          semester,
          branch
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Profile updated successfully!');
        // Optionally update sessionStorage if avatar changed:
        sessionStorage.setItem('avatar', data.user.avatar || '');
      } else {
        alert('❌ Failed to update profile: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('❌ Error updating profile. Check console for details.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("❌ New passwords do not match!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'username': username
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Password changed successfully!');
        setShowPasswordChange(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('❌ Failed to change password: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('❌ Error changing password. Check console.');
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>
        
        <div className="section">
          <h3 className="section-title">Select Avatar</h3>
          <div className="avatar-grid">
            {avatarOptions.map((avatar, index) => (
              <button
                key={index}
                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <span style={{ fontSize: '32px' }}>{avatar}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <label className="profile-label">Description (optional):</label>
          <textarea
            className="profile-textarea"
            placeholder="Tell us something about yourself..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex-row">
          <div className="half-width">
            <label className="profile-label">Semester (optional):</label>
            <select className="profile-input" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((sem, idx) => (
                <option key={idx} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="half-width">
            <label className="profile-label">Branch (optional):</label>
            <select className="profile-input" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">Select Branch</option>
              {branches.map((b, idx) => (
                <option key={idx} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-group">
          <button className="primary-button" onClick={handleProfileUpdate}>
            💾 Save Profile
          </button>
          
          <button 
            className="secondary-button" 
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            🔒 Change Password
          </button>
        </div>

        {showPasswordChange && (
          <div className="password-section">
            <h3 className="section-title">Change Password</h3>
            <div className="password-form">
              <input
                type="password"
                className="profile-input"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="profile-input"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="profile-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <div className="password-buttons">
                <button className="primary-button" onClick={handlePasswordChange}>
                  ✅ Update Password
                </button>
                <button 
                  className="cancel-button" 
                  onClick={() => setShowPasswordChange(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
