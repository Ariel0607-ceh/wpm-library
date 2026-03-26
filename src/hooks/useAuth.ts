import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/types';

const ADMIN_USER: User = {
  id: 'admin-1',
  username: 'Naufal',
  password: 'naufal0607',
  role: 'admin'
};

const DEFAULT_USERS: User[] = [ADMIN_USER];

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Always start logged out - clear any existing session
    localStorage.removeItem('wpm_current_user');
    setCurrentUser(null);
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    setError(null);
    
    const users: User[] = JSON.parse(localStorage.getItem('wpm_users') || '[]');
    const allUsers = users.length > 0 ? users : DEFAULT_USERS;
    
    const user = allUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('wpm_current_user', JSON.stringify(user));
      return true;
    } else {
      setError('Nama pengguna atau kata laluan tidak sah');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('wpm_current_user');
    setError(null);
  }, []);

  const isAdmin = useCallback(() => {
    return currentUser?.role === 'admin';
  }, [currentUser]);

  return {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!currentUser
  };
}
