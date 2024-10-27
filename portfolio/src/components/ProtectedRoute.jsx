import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = sessionStorage.getItem('access_token');
      const storedUserType = sessionStorage.getItem('user_type');
      setIsUserAuthenticated(!!token);
      setUserType(storedUserType);
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isUserAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Redirect based on user role
  switch (userType) {
    case '1': // Doctor
      if (location.pathname !== '/Admin') {
        return <Navigate to="/Admin" replace />;
      }
      break;
    case '2': // Accountant
      if (location.pathname !== '/landing') {
        return <Navigate to="/landing" replace />;
      }
      break;
    default:
      return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
