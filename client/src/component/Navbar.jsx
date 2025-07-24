<<<<<<< HEAD

import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import { useEffect, useRef, useState } from 'react';
import '../style/Navbar.css';

export default function Navbar() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const menuRef = useRef();

  // Load user avatar on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const storedAvatar = sessionStorage.getItem('avatar');
      if (storedAvatar) {
        setUserAvatar(storedAvatar);
      } else {
        // Fetch avatar from API if not in sessionStorage
        fetchUserAvatar();
      }
    }
  }, [isLoggedIn]);

  const fetchUserAvatar = async () => {
    try {
      const username = sessionStorage.getItem('username');
      if (!username) return;

      const response = await fetch('http://localhost:5000/api/user-profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'username': username
        }
      });

      if (response.ok) {
        const data = await response.json();
        const avatar = data.avatar || '👨‍🎓'; // Default avatar
        setUserAvatar(avatar);
        sessionStorage.setItem('avatar', avatar);
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

  const handleUploadClick = () => {
    if (isLoggedIn) {
      navigate('/upload');
    } else {
      navigate('/login', { state: { from: '/upload' } });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('username');
    sessionStorage.clear(); // Clear session storage on login page load
    setShowMenu(false);
    setUserAvatar(null);
    navigate('/');
  };

  const renderProfileDP = () => {
    // Check if userAvatar is an emoji (Unicode character)
    if (userAvatar && /\p{Extended_Pictographic}/u.test(userAvatar)) {
      return (
        <div className="avatar-emoji-dp">
          {userAvatar}
        </div>
      );
    }
    // Fallback to default image
    return (
      <img
        src="/src/assets/images/user-icon.jpg"
        alt="User"
        className="dp-icon"
      />
    );
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header>
      <div className="logo">NotesMittar</div>
      <nav>
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <Link to="/scoreboard">Scoreboard</Link>

        {isLoggedIn ? (
          <div className="profile-dp-wrapper" ref={menuRef}>
            <div
              className="dp-container"
              onClick={() => setShowMenu(!showMenu)}
            >
              {renderProfileDP()}
            </div>
            {showMenu && (
              <div className="dropdown-menu">
                {sessionStorage.getItem('isAdmin') === 'true' && (
                  <button onClick={() => navigate('/adminHome')}>
                    Admin Dashboard
                  </button>
                )}
                <button onClick={() => navigate('/ProfilePage')}>
                  Profile
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

    </header>
  );
}
=======

import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../style/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('loggedIn') === 'true');
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      const token = sessionStorage.getItem('token');
      const username = sessionStorage.getItem('username');
      if (!token && !username) return;

      const res = await fetch('http://localhost:5000/api/user-profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          username
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        fallbackUser();
      }
    } catch (err) {
      console.error(err);
      fallbackUser();
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fallbackUser = () => {
    const username = sessionStorage.getItem('username');
    const email = sessionStorage.getItem('email');
    const contact = sessionStorage.getItem('contact');
    const avatar = sessionStorage.getItem('avatar');
    if (username && email) {
      setUser({
        username,
        email,
        contact,
        avatar
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    setShowSidebar(false);
    navigate('/');
  };

  const handleUploadClick = () => {
    if (isLoggedIn) {
      navigate('/upload');
    } else {
      navigate('/login', { state: { from: '/upload' } });
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <>
      <header>
        <div className="logo">NotesMittar</div>
        
        <nav>
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <Link to="/scoreboard">Scoreboard</Link>
          
          <div className="profile-section">
            {isLoggedIn && user ? (
              <>
                <button onClick={handleUploadClick} className="upload-btn">
                  Upload
                </button>
                
                <div className={`profile-dp-wrapper ${showSidebar ? 'active' : ''}`}>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className={`dp-icon ${isLoadingUser ? 'loading' : ''}`}
                      onClick={toggleSidebar}
                    />
                  ) : (
                    <div 
                      className={`dp-icon default-avatar ${isLoadingUser ? 'loading' : ''}`} 
                      onClick={toggleSidebar}
                    >
                      <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="8" r="3" fill="currentColor"/>
                        <path d="M12 14c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" fill="currentColor"/>
                      </svg>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="upload-btn">Login</Link>
            )}
          </div>
        </nav>
      </header>

      <Sidebar 
        isOpen={showSidebar}
        onClose={toggleSidebar}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
