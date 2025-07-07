
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
