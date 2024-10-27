import { useNavigate } from 'react-router-dom';

const useRedirectToLogin = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  return redirectToLogin;
};

export default useRedirectToLogin;