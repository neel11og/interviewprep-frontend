// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { authAPI, apiUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Try to get backend user profile
          const backendProfile = await authAPI.getCurrentUser();
          setBackendUser(backendProfile.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.warn('Backend authentication failed:', error);
          // If backend auth fails, we still have Firebase auth
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setBackendUser(null);
        setIsAuthenticated(false);
        apiUtils.removeAuthToken();
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with email and password (backend)
  const loginWithEmail = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      apiUtils.setAuthToken(response.data.access_token);
      
      // Get user profile
      const userProfile = await authAPI.getCurrentUser();
      setBackendUser(userProfile.data);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: apiUtils.handleError(error) };
    }
  };

  // Register with email and password (backend)
  const registerWithEmail = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      apiUtils.setAuthToken(response.data.access_token);
      
      // Get user profile
      const userProfile = await authAPI.getCurrentUser();
      setBackendUser(userProfile.data);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: apiUtils.handleError(error) };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear backend auth
      apiUtils.removeAuthToken();
      
      setUser(null);
      setBackendUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: apiUtils.handleError(error) };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setBackendUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: apiUtils.handleError(error) };
    }
  };

  // Sync Firebase user with backend
  const syncWithBackend = async () => {
    if (user && !backendUser) {
      try {
        // Try to get backend user profile
        const backendProfile = await authAPI.getCurrentUser();
        setBackendUser(backendProfile.data);
      } catch (error) {
        console.warn('Failed to sync with backend:', error);
      }
    }
  };

  const value = {
    // State
    user,
    backendUser,
    loading,
    isAuthenticated,
    
    // Actions
    loginWithEmail,
    registerWithEmail,
    logout,
    updateProfile,
    syncWithBackend,
    
    // Utilities
    hasBackendAuth: !!backendUser,
    displayName: backendUser?.full_name || user?.displayName || 'User',
    email: backendUser?.email || user?.email || '',
    photoURL: user?.photoURL || '',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
