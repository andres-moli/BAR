import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, LoginCredentials, UserRole } from '@/types';
import { authService } from '@/services/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, token, isAuthenticated, setAuth, logout: storeLogout, updateUser: storeUpdateUser } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setAuth(response.token, response.user);
  };

  const logout = () => {
    storeLogout();
    toast.success('Sesión cerrada');
  };

  const updateUser = (updatedUser: User) => {
    storeUpdateUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading: false,
        login,
        logout,
        updateUser,
        isAdmin: user?.rol === 'admin' || user?.role === 'admin',
        hasRole: (role: UserRole) => user?.rol === role || user?.role === role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
