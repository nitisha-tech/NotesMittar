
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
<<<<<<< HEAD
import GoogleIcon from '../assets/images/google-icon.jpg';
import '../style/Auth.css';
import Navbar from '../component/Navbar';

function Login() {
  
=======
import GoogleIcon from '../assets/images/google-icon.jpg'; // Import Google icon image
import '../style/Auth.css'; // Shared CSS for login/signup
import Navbar from '../component/Navbar';

function Login() {
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
  const BASE_URL = 'http://localhost:5000/api';
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
<<<<<<< HEAD
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      return alert('Please fill all fields.');
=======
  e.preventDefault();

  if (!usernameOrEmail || !password) {
    return alert('Please fill all fields.');
  }

  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });

    const data = await res.json();

    if (res.ok) {
      if(data.user.status === 'suspended'){
          alert('Your account has been suspended. Please contact support.');
          sessionStorage.clear(); // Clear any partial login info
          return;
       }
      alert('Login successful!');
      sessionStorage.setItem('loggedIn', 'true');
      // ✅ Save individual fields for easier access
      sessionStorage.setItem('username', data.user.username);
      sessionStorage.setItem('email', data.user.email);
      sessionStorage.setItem('contact', data.user.contactNumber || '');
      sessionStorage.setItem('avatar', data.user.avatar || '');

      sessionStorage.setItem('user', JSON.stringify({
      username: data.user.username,
      email: data.user.email,
      name: data.user.name,
      contactNumber: data.user.contactNumber || '',
      avatar: data.user.avatar || ''
}));

      navigate('/');
    } else {
      alert(data.error || 'Login failed');
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    }
  } catch (err) {
    alert('Something went wrong: ' + err.message);
  }
};

<<<<<<< HEAD
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      const data = await res.json();

      if (res.ok) {
        // Store basic user info
        if(data.user.status === 'suspended'){
          alert('Your account has been suspended. Please contact support.');
          sessionStorage.clear(); // Clear any partial login info
          return;
        }
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('userId', data.user._id);
        sessionStorage.setItem('username', data.user.username);
        sessionStorage.setItem('email', data.user.email);
        sessionStorage.setItem('name', data.user.name);
        
        // Store user object
        sessionStorage.setItem('user', JSON.stringify({
          username: data.user.username,
          email: data.user.email
        }));

        // Handle avatar - FIXED: use data.user.avatar instead of res.avatar
        if (data.user.avatar) {
          sessionStorage.setItem('avatar', data.user.avatar);
        }

        // ✅ FIXED: Properly handle admin status with explicit boolean check
        console.log('Login response isAdmin:', data.user.isAdmin, typeof data.user.isAdmin);
        
        if (data.user.isAdmin === true) {
          sessionStorage.setItem('isAdmin', 'true');
          sessionStorage.setItem('admin', JSON.stringify(data.user));
          console.log('✅ Admin user logged in:', data.user.username);
        } else {
          sessionStorage.setItem('isAdmin', 'false');
          sessionStorage.removeItem('admin');
          console.log('Regular user logged in:', data.user.username);
        }

        navigate('/');
      } else {
        alert(data.error || 'Login failed');
      }

    } catch (err) {
      alert('Something went wrong: ' + err.message);
    }
  };
=======

>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8

  return (
    <>
      <Navbar />
      <div className="login-body">
        <div className="login-container">
<<<<<<< HEAD
          <h2>Welcome back Mittar</h2>
=======
          <h2>Welcome back to Mittar</h2>
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
          <p className="subtext">Tera Exam ka Sacha Yaar</p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />

<<<<<<< HEAD
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="or">or</p>

=======

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="or">or</p>

>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
          <button className="google-login-btn">
            <img src={GoogleIcon} alt="Google Icon" />
            Continue with Google
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;