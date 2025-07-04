import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GoogleIcon from '../assets/images/google-icon.jpg'; // Import Google icon image
import '../style/Auth.css'; // Shared CSS for login/signup
import Navbar from '../component/Navbar';

function Login() {
  const BASE_URL = 'http://localhost:5000/api';
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
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
    }
  } catch (err) {
    alert('Something went wrong: ' + err.message);
  }
};




  return (
    <>
      <Navbar />
      <div className="login-body">
        <div className="login-container">
          <h2>Welcome back to Mittar</h2>
          <p className="subtext">Tera Exam ka Sacha Yaar</p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />


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
