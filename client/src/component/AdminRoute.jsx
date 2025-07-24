
// component/AdminRoute.jsx
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const role = sessionStorage.getItem('role');
  const adminUsernames = ['q', 'h', 'rahul'];
  const username = sessionStorage.getItem('username');

  if (role === 'admin' || adminUsernames.includes(username)) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default AdminRoute;
