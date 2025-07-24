<<<<<<< HEAD

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

=======

import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

>>>>>>> 06c128c0d22097dd48c9533a353c8c3e39cc3bb8
export default ProtectedRoute;