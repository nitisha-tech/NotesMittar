
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Leaderboard.css';
<<<<<<< HEAD
import Navbar from '../component/Navbar';
=======

>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load leaderboard:', err));
  }, []);

  const filteredUsers = users.filter((user) =>
<<<<<<< HEAD
  user.username.toLowerCase().includes(searchTerm.toLowerCase())
);

=======
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8

  const rankBadge = (index) => {
    const badges = ['🥇', '🥈', '🥉'];
    return badges[index] || `#${index + 1}`;
  };

  return (
<<<<<<< HEAD
    <>
    <Navbar/>

=======
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
    <div className="container">
      <h2 className="page-title">📚 Leaderboard</h2>

      <input
        type="text"
        className="search-box"
        placeholder="Search contributor by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No matching contributors found.</p>
      ) : (
        filteredUsers.map((user, idx) => (
          <div
            key={user.username}
            className="user-card"
<<<<<<< HEAD
            onClick={() => navigate(`/Contributor/${user.username}`)}
          >
            <div className="user-info">
              <h3>{rankBadge(idx)} {user.username}</h3>
              <p>Uploads: {user.totalUploads}</p>
=======
            onClick={() => navigate(`/contributor/${user.username}`)}
          >
            <div className="user-info">
              <h3>{rankBadge(idx)} {user.username}</h3>
              <p>📄 Uploads: {user.totalUploads}</p>
              <p>📧 {user.email}</p>
              {user.contact && <p>📱 {user.contact}</p>}
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
            </div>
            <div className="view-link">View Profile →</div>
          </div>
        ))
      )}
    </div>
<<<<<<< HEAD
        </>
  );
}

export default LeaderboardPage;
=======
  );
}

export default LeaderboardPage;
>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
