import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';

const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL || 'https://tasky-backend-0a2q.onrender.com').replace(/\/$/, '');

const normalizeAvatar = (avatar) => {
  if (!avatar) return '';
  if (avatar.startsWith('http')) return avatar;
  return `${BACKEND_ORIGIN}${avatar}`;
};

const normalizeUser = (u) => {
  if (!u) return u;
  return { ...u, avatar: normalizeAvatar(u.avatar) };
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        const fetched = data.user ?? data;
        setUser(normalizeUser(fetched));
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(normalizeUser(data.user));
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(normalizeUser(data.user));
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    // Ensure avatar is an absolute URL so img src works after refresh
    const fields = { ...updatedFields };
    if (fields.avatar) {
      fields.avatar = normalizeAvatar(fields.avatar);
    }
    setUser((prev) => ({ ...prev, ...fields }));
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
    updateUser,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
