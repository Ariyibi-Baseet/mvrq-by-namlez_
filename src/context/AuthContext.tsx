import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAdminAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mvrq_admin_auth') === 'true';
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const login = (password: string): boolean => {
    // Accepts 'admin', 'mvrq', 'mvrq2026', or '123456'
    const validPasswords = ['admin', 'mvrq', 'mvrq2026', '123456'];
    if (validPasswords.includes(password.toLowerCase().trim())) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('mvrq_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('mvrq_admin_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated,
        login,
        logout,
        isAdminOpen,
        setIsAdminOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
