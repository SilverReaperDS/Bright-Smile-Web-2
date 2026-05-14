// src/pages/Logout/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  }, [navigate]);

  return null;
}
