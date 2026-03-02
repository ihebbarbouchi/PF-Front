'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:8000/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  completeProfile: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isAuthenticated = !!token && !!user;

  // On mount, check if user is already logged in from sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem('auth_token');
    const storedUser = sessionStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Protected routes check
  useEffect(() => {
    if (!isLoading) {
      const protectedPaths = ['/super-admin', '/teacher', '/student', '/add-resource', '/quiz'];
      const currentPath = window.location.pathname;

      const isProtected = protectedPaths.some(path => currentPath.startsWith(path));

      if (isProtected && !isAuthenticated) {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Invalid credentials' };
      }

      // Store token and user in state + localStorage
      setToken(data.token);
      setUser(data.user);
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('auth_user', JSON.stringify(data.user));

      // Redirect based on role
      const role = data.user.role;
      if (role === 'super-admin') {
        router.push('/super-admin');
      } else if (role === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/student');
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please check if the server is running.' };
    }
  };

  const signup = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || (data.errors ? Object.values(data.errors).flat().join(', ') : 'Registration failed');
        return { success: false, error: errorMessage };
      }

      // Store token and user in state + sessionStorage
      setToken(data.token);
      setUser(data.user);
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('auth_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error.' };
    }
  };

  const completeProfile = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_URL}/complete-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Profile update failed' };
      }

      setUser(data.user);
      sessionStorage.setItem('auth_user', JSON.stringify(data.user));

      return { success: true };
    } catch (error) {
      console.error('Complete profile error:', error);
      return { success: false, error: 'Network error.' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state and localStorage regardless
      setToken(null);
      setUser(null);
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        completeProfile,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
