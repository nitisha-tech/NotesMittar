
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../style/Navbar.css';
import Profile from './Profile'; // ✅ Sidebar profile component

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('loggedIn') === 'true');
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

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
    navigate('/');
  };

  const handleUploadClick = () => {
    if (isLoggedIn) {
      navigate('/upload');
    } else {
      navigate('/login', { state: { from: '/upload' } });
    }
  };

  return (
    <header className="navbar">
      <div className="logo">NotesMittar</div>
      <nav>
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <Link to="/scoreboard">Scoreboard</Link>

        {isLoggedIn && user ? (
          <>
            <img
              src={user.avatar || '/src/assets/images/user-icon.jpg'} // fallback avatar
              alt="Avatar"
              className="dp-icon"
              onClick={() => setShowProfileSidebar(prev => !prev)}
              style={{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
            />
            {showProfileSidebar && (
              <Profile
                user={user}
                onLogout={handleLogout}
                closeSidebar={() => setShowProfileSidebar(false)}
              />
            )}
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
