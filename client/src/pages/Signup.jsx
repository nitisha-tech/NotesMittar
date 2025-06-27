
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Auth.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      alert('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        alert(data.msg || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Server error');
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Create your MittarID</h2>
        <p className="subtext">Tere Preparation Ka Naya Yaar</p>

        <form className="login-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Choose a username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
